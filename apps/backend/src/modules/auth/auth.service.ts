import { prisma } from '../../config/database';
import { jwtService } from '../../utils/jwt';
import { CryptoService } from '../../utils/crypto';
import { Sanitizer } from '../../utils/sanitizer';
import { logger } from '../../config/logger';
import { queueManager } from '../../config/queue';
import { env } from '../../config/env';
import { EmailService } from '../../services/email-service';
import {
  AppError, ConflictError, UnauthorizedError, NotFoundError, ValidationError,
} from '../../middleware/error-handler';
import {
  RegisterDTO, LoginDTO, AuthResponse, TokenResponse, ResetPasswordDTO, ChangePasswordDTO, UpdateProfileDTO,
} from './auth.types';
import { v4 as uuidv4 } from 'uuid';

function normalizeUser(dbUser: any) {
  return {
    id: dbUser.id || dbUser.Id,
    email: dbUser.email || dbUser.Email,
    passwordHash: dbUser.passwordHash || dbUser.password_hash || dbUser.PasswordHash,
    fullName: dbUser.fullName || dbUser.full_name || dbUser.FullName,
    avatarUrl: dbUser.avatarUrl || dbUser.avatar_url || dbUser.AvatarUrl,
    role: dbUser.role || dbUser.Role || 'CUSTOMER',
    emailVerified: dbUser.emailVerified || dbUser.email_verified || dbUser.EmailVerified || false,
    lastLoginAt: dbUser.lastLoginAt || dbUser.last_login_at || dbUser.LastLoginAt,
    createdAt: dbUser.createdAt || dbUser.created_at || dbUser.CreatedAt,
    updatedAt: dbUser.updatedAt || dbUser.updated_at || dbUser.UpdatedAt,
  };
}

export class AuthService {

  // ============================================
  // REGISTER
  // ============================================
  public static async register(data: RegisterDTO): Promise<AuthResponse> {
    const { email, password, fullName } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await CryptoService.hashPassword(password);

    // Create user (emailVerified = false by default)
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: email.toLowerCase().trim(),
        passwordHash,
        fullName: fullName || null,
        emailVerified: false,
      },
    });

    const normalized = normalizeUser(user);
    const tokens = this.generateTokens(normalized.id, normalized.email, normalized.role);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        userId: normalized.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Send verification email
    await this.sendVerificationEmail(normalized.id, normalized.email, fullName);

    logger.info(`New user registered: ${normalized.email}`);

    return {
      user: {
        id: normalized.id,
        email: normalized.email,
        fullName: normalized.fullName,
        avatarUrl: normalized.avatarUrl,
        role: normalized.role,
        emailVerified: false,
      },
      tokens,
    };
  }

  // ============================================
  // LOGIN
  // ============================================
  public static async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user
    const dbUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!dbUser) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user = normalizeUser(dbUser);

    // Check password exists
    if (!user.passwordHash) {
      logger.error(`User ${email} has no password hash!`);
      throw new UnauthorizedError('Account not properly set up. Please contact support.');
    }

    // Verify password
    const isValidPassword = await CryptoService.comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // ENFORCE EMAIL VERIFICATION
    if (!user.emailVerified) {
      // Auto-resend verification email
      await this.sendVerificationEmail(user.id, user.email, user.fullName);
      throw new UnauthorizedError(
        'Please verify your email before logging in. A new verification link has been sent to your inbox.'
      );
    }

    // Revoke old refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revoked: false },
      data: { revoked: true },
    });

    // Generate new tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    // Save new refresh token
    await prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`User logged in: ${user.email} (role: ${user.role})`);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      tokens,
    };
  }

  // ============================================
  // REFRESH TOKEN
  // ============================================
  public static async refresh(refreshTokenStr: string): Promise<TokenResponse> {
    const decoded = jwtService.verifyRefreshToken(refreshTokenStr);

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshTokenStr,
        userId: decoded.sub,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // Generate new tokens
    const tokens = this.generateTokens(decoded.sub, decoded.email, decoded.role);

    // Save new refresh token
    await prisma.refreshToken.create({
      data: {
        id: uuidv4(),
        userId: decoded.sub,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  // ============================================
  // LOGOUT
  // ============================================
  public static async logout(refreshTokenStr: string, userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
    logger.info(`User logged out: ${userId}`);
  }

  // ============================================
  // FORGOT PASSWORD
  // ============================================
  public static async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      logger.info(`Password reset requested for unknown email: ${email}`);
      return;
    }

    const resetToken = jwtService.generatePasswordResetToken(user.id, user.email);

    if (env.ENABLE_EMAIL_NOTIFICATIONS && env.RESEND_API_KEY) {
      try {
        const frontendUrl = (env as any).FRONTEND_URL || 'https://devglobal-hub-alpha.vercel.app';
        await EmailService.sendPasswordResetEmail(user.email, {
          name: user.fullName || 'User',
          resetLink: `${frontendUrl}/reset-password?token=${resetToken}`,
        });
        logger.info(`Password reset email sent to: ${user.email}`);
      } catch (error) {
        logger.error('Failed to send password reset email');
      }
    }
  }

  // ============================================
  // RESET PASSWORD
  // ============================================
  public static async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const decoded = jwtService.verifyResetToken(data.token);

    const dbUser = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!dbUser) throw new NotFoundError('User not found');

    const passwordHash = await CryptoService.hashPassword(data.newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: decoded.sub },
        data: { passwordHash },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: decoded.sub, revoked: false },
        data: { revoked: true },
      }),
    ]);

    logger.info(`Password reset for user: ${decoded.sub}`);
  }

  // ============================================
  // VERIFY EMAIL
  // ============================================
  public static async verifyEmail(token: string): Promise<void> {
    const decoded = jwtService.verifyEmailToken(token);

    await prisma.user.update({
      where: { id: decoded.sub },
      data: { emailVerified: true },
    });

    logger.info(`Email verified for user: ${decoded.sub}`);
  }

  // ============================================
  // RESEND VERIFICATION EMAIL
  // ============================================
  public static async resendVerification(userId: string): Promise<void> {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) throw new NotFoundError('User not found');

    const user = normalizeUser(dbUser);

    if (user.emailVerified) {
      throw new AppError('Email is already verified', 400, 'ALREADY_VERIFIED');
    }

    await this.sendVerificationEmail(user.id, user.email, user.fullName);
  }

  // ============================================
  // GET PROFILE
  // ============================================
  public static async getProfile(userId: string) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!dbUser) throw new NotFoundError('User not found');

    return dbUser;
  }

  // ============================================
  // UPDATE PROFILE
  // ============================================
  public static async updateProfile(userId: string, data: UpdateProfileDTO) {
    const updateData: any = {};

    if (data.fullName) {
      updateData.fullName = Sanitizer.sanitizePlainText(data.fullName);
    }
    if (data.avatarUrl) {
      updateData.avatarUrl = Sanitizer.sanitizeUrl(data.avatarUrl);
    }

    const dbUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        emailVerified: true,
        updatedAt: true,
      },
    });

    return dbUser;
  }

  // ============================================
  // CHANGE PASSWORD
  // ============================================
  public static async changePassword(userId: string, data: ChangePasswordDTO): Promise<void> {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true, id: true },
    });

    if (!dbUser) throw new NotFoundError('User not found');

    const user = normalizeUser(dbUser);

    // Verify current password
    const isValid = await CryptoService.comparePassword(data.currentPassword, user.passwordHash);
    if (!isValid) throw new ValidationError('Current password is incorrect');

    // Hash new password
    const newHash = await CryptoService.hashPassword(data.newPassword);

    // Update password and revoke all tokens
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      }),
      prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
      }),
    ]);

    logger.info(`Password changed for user: ${userId}`);
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  private static generateTokens(userId: string, email: string, role: string): TokenResponse {
    return {
      accessToken: jwtService.generateAccessToken(userId, email, role),
      refreshToken: jwtService.generateRefreshToken(userId, email, role),
      expiresIn: 15 * 60,
      tokenType: 'Bearer',
    };
  }

  private static async sendVerificationEmail(
    userId: string,
    email: string,
    fullName?: string | null
  ): Promise<void> {
    if (!env.ENABLE_EMAIL_NOTIFICATIONS || !env.RESEND_API_KEY) {
      logger.warn('Email notifications disabled or Resend API key missing. Skipping verification email.');
      return;
    }

    try {
      const verificationToken = jwtService.generateEmailVerificationToken(userId, email);
      const frontendUrl = (env as any).FRONTEND_URL || 'https://devglobal-hub-alpha.vercel.app';
      const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

      await EmailService.sendVerificationEmail(email, {
        name: fullName || 'User',
        verificationLink: verifyLink,
      });

      logger.info(`Verification email sent to: ${email}`);
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}`);
    }
  }
}