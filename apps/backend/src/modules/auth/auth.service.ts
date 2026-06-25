import { prisma } from '../../config/database';
import { jwtService } from '../../utils/jwt';
import { CryptoService } from '../../utils/crypto';
import { Sanitizer } from '../../utils/sanitizer';
import { logger } from '../../config/logger';
import { queueManager } from '../../config/queue';
import { env } from '../../config/env';
import {
  AppError, ConflictError, UnauthorizedError, NotFoundError, ValidationError,
} from '../../middleware/error-handler';
import {
  RegisterDTO, LoginDTO, AuthResponse, TokenResponse, ResetPasswordDTO, ChangePasswordDTO, UpdateProfileDTO,
} from './auth.types';
import { v4 as uuidv4 } from 'uuid';

// Helper to normalize user data from database (handles snake_case from Supabase)
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
  public static async register(data: RegisterDTO): Promise<AuthResponse> {
    const { email, password, fullName } = data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictError('User with this email already exists');
    const passwordHash = await CryptoService.hashPassword(password);
    const user = await prisma.user.create({
      data: { id: uuidv4(), email, passwordHash, fullName: fullName || null },
    });
    const normalized = normalizeUser(user);
    const tokens = this.generateTokens(normalized.id, normalized.email, normalized.role);
    await prisma.refreshToken.create({
      data: { id: uuidv4(), userId: normalized.id, token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    return { user: { id: normalized.id, email: normalized.email, fullName: normalized.fullName, avatarUrl: normalized.avatarUrl, role: normalized.role, emailVerified: normalized.emailVerified }, tokens };
  }

  public static async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    const dbUser = await prisma.user.findUnique({ where: { email } });

    if (!dbUser) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user = normalizeUser(dbUser);

    if (!user.passwordHash) {
      logger.error(`User ${email} has no password hash!`);
      throw new UnauthorizedError('Account not properly set up. Please contact support.');
    }

    const isValidPassword = await CryptoService.comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role);
    await prisma.refreshToken.create({
      data: { id: uuidv4(), userId: user.id, token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    
    logger.info(`User logged in: ${user.email} (role: ${user.role})`);

    return {
      user: { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, role: user.role, emailVerified: user.emailVerified },
      tokens,
    };
  }

  public static async refresh(refreshTokenStr: string): Promise<TokenResponse> {
    const decoded = jwtService.verifyRefreshToken(refreshTokenStr);
    const storedToken = await prisma.refreshToken.findFirst({
      where: { token: refreshTokenStr, userId: decoded.sub, revoked: false, expiresAt: { gt: new Date() } },
    });
    if (!storedToken) throw new UnauthorizedError('Invalid or expired refresh token');
    await prisma.refreshToken.update({ where: { id: storedToken.id }, data: { revoked: true } });
    const tokens = this.generateTokens(decoded.sub, decoded.email, decoded.role);
    await prisma.refreshToken.create({
      data: { id: uuidv4(), userId: decoded.sub, token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });
    return tokens;
  }

  public static async logout(refreshTokenStr: string, userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({ where: { userId, revoked: false }, data: { revoked: true } });
  }

  public static async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return;
  }

  public static async resetPassword(data: ResetPasswordDTO): Promise<void> {
    const decoded = jwtService.verifyResetToken(data.token);
    const dbUser = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!dbUser) throw new NotFoundError('User');
    const user = normalizeUser(dbUser);
    const passwordHash = await CryptoService.hashPassword(data.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    await prisma.refreshToken.updateMany({ where: { userId: user.id, revoked: false }, data: { revoked: true } });
  }

  public static async verifyEmail(token: string): Promise<void> {
    const decoded = jwtService.verifyEmailToken(token);
    await prisma.user.update({ where: { id: decoded.sub }, data: { emailVerified: true } });
  }

  public static async getProfile(userId: string) {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) throw new NotFoundError('User');
    const user = normalizeUser(dbUser);
    return { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, role: user.role, emailVerified: user.emailVerified, lastLoginAt: user.lastLoginAt, createdAt: user.createdAt };
  }

  public static async updateProfile(userId: string, data: UpdateProfileDTO) {
    const dbUser = await prisma.user.update({
      where: { id: userId },
      data: { ...(data.fullName && { fullName: Sanitizer.sanitizePlainText(data.fullName) }), ...(data.avatarUrl && { avatarUrl: Sanitizer.sanitizeUrl(data.avatarUrl) }) },
    });
    const user = normalizeUser(dbUser);
    return { id: user.id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl, role: user.role, emailVerified: user.emailVerified, updatedAt: user.updatedAt };
  }

  public static async changePassword(userId: string, data: ChangePasswordDTO): Promise<void> {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) throw new NotFoundError('User');
    const user = normalizeUser(dbUser);
    const isValid = await CryptoService.comparePassword(data.currentPassword, user.passwordHash);
    if (!isValid) throw new ValidationError('Current password is incorrect');
    const newHash = await CryptoService.hashPassword(data.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    await prisma.refreshToken.updateMany({ where: { userId: user.id, revoked: false }, data: { revoked: true } });
  }

  private static generateTokens(userId: string, email: string, role: string): TokenResponse {
    return {
      accessToken: jwtService.generateAccessToken(userId, email, role),
      refreshToken: jwtService.generateRefreshToken(userId, email, role),
      expiresIn: 15 * 60,
      tokenType: 'Bearer',
    };
  }
}