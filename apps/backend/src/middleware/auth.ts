// JWT authentication
// TODO: Add authentication middleware
import { Request, Response, NextFunction } from 'express';
import { jwtService, TokenPayload } from '../utils/jwt';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload & {
        fullName?: string;
        avatarUrl?: string;
        emailVerified?: boolean;
      };
    }
  }
}

export class AuthMiddleware {
  public static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'NO_AUTH_HEADER',
        });
        return;
      }

      const parts = authHeader.split(' ');

      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({
          success: false,
          error: 'Invalid authorization format. Use: Bearer <token>',
          code: 'INVALID_AUTH_FORMAT',
        });
        return;
      }

      const token = parts[1];

      if (!token) {
        res.status(401).json({
          success: false,
          error: 'Token is required',
          code: 'TOKEN_REQUIRED',
        });
        return;
      }

      // Verify token
      const decoded = jwtService.verifyAccessToken(token);

      // Check if user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: {
          id: true,
          email: true,
          role: true,
          fullName: true,
          avatarUrl: true,
          emailVerified: true,
        },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
        return;
      }

      // Attach user to request
      req.user = {
        ...decoded,
        fullName: user.fullName || undefined,
        avatarUrl: user.avatarUrl || undefined,
        emailVerified: user.emailVerified,
      };

      next();
    } catch (error: any) {
      logger.warn('Authentication failed:', error.message);

      if (error.message === 'Token expired') {
        res.status(401).json({
          success: false,
          error: 'Token has expired',
          code: 'TOKEN_EXPIRED',
        });
        return;
      }

      if (error.message === 'Invalid token') {
        res.status(401).json({
          success: false,
          error: 'Invalid token',
          code: 'INVALID_TOKEN',
        });
        return;
      }

      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        code: 'AUTH_FAILED',
      });
    }
  }

  public static optionalAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    AuthMiddleware.authenticate(req, res, (err) => {
      // If auth fails, continue without user
      next();
    });
  }
}