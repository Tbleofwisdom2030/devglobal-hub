import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { logger } from '../../config/logger';
import { AppError } from '../../middleware/error-handler';

export class AuthController {
  static refresh(arg0: string, arg1: (req: Request, res: Response, next: NextFunction) => void, refresh: any) {
    throw new Error('Method not implemented.');
  }
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AuthService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AuthService.login(req.body);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/api/v1/auth',
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          expiresIn: result.tokens.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshTokenStr =
        req.body.refreshToken || req.cookies?.refreshToken;

      if (!refreshTokenStr) {
        throw new AppError('Refresh token is required', 400, 'TOKEN_REQUIRED');
      }

      const tokens: any = await AuthService.refreshToken(refreshTokenStr);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth',
      });

      res.json({
        success: true,
        data: {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshTokenStr =
        req.body.refreshToken || req.cookies?.refreshToken;

      if (refreshTokenStr && req.user) {
        await AuthService.logout(refreshTokenStr, req.user.sub);
      }

      res.clearCookie('refreshToken', { path: '/api/v1/auth' });

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await AuthService.forgotPassword(req.body.email);

      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message:
          'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await AuthService.resetPassword(req.body);

      res.json({
        success: true,
        message:
          'Password reset successful. Please log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await AuthService.verifyEmail(req.body.token);

      res.json({
        success: true,
        message: 'Email verified successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await AuthService.getProfile(req.user!.sub);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await AuthService.updateProfile(req.user!.sub, req.body);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await AuthService.changePassword(req.user!.sub, req.body);

      res.clearCookie('refreshToken', { path: '/api/v1/auth' });

      res.json({
        success: true,
        message:
          'Password changed successfully. Please log in again.',
      });
    } catch (error) {
      next(error);
    }
  }
}