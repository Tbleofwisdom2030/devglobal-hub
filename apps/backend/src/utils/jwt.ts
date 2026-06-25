// JWT generation/verification
// TODO: Add JWT utilities
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../config/logger';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  type: 'access' | 'refresh' | 'reset' | 'verify';
  iat?: number;
  exp?: number;
}

export class JWTService {
  private accessSecret: string;
  private refreshSecret: string;

  constructor() {
    this.accessSecret = env.JWT_ACCESS_SECRET;
    this.refreshSecret = env.JWT_REFRESH_SECRET;
  }

  public generateAccessToken(
    userId: string,
    email: string,
    role: string
  ): string {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      role,
      type: 'access',
    };

    const options: SignOptions = {
      expiresIn: env.JWT_ACCESS_EXPIRATION as SignOptions['expiresIn'],
      algorithm: 'HS256',
      issuer: 'devglobal-hub',
      audience: 'devglobal-api',
    };

    return jwt.sign(payload, this.accessSecret, options);
  }

  public generateRefreshToken(
    userId: string,
    email: string,
    role: string
  ): string {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      role,
      type: 'refresh',
    };

    const options: SignOptions = {
      expiresIn: env.JWT_REFRESH_EXPIRATION as SignOptions['expiresIn'],
      algorithm: 'HS256',
      issuer: 'devglobal-hub',
      audience: 'devglobal-api',
    };

    return jwt.sign(payload, this.refreshSecret, options);
  }

  public generatePasswordResetToken(userId: string, email: string): string {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      role: 'CUSTOMER',
      type: 'reset',
    };

    const options: SignOptions = {
      expiresIn: '1h',
      algorithm: 'HS256',
      issuer: 'devglobal-hub',
      audience: 'devglobal-api',
    };

    return jwt.sign(payload, this.accessSecret, options);
  }

  public generateEmailVerificationToken(userId: string, email: string): string {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      sub: userId,
      email,
      role: 'CUSTOMER',
      type: 'verify',
    };

    const options: SignOptions = {
      expiresIn: '24h',
      algorithm: 'HS256',
      issuer: 'devglobal-hub',
      audience: 'devglobal-api',
    };

    return jwt.sign(payload, this.accessSecret, options);
  }

  public verifyAccessToken(token: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256'],
        issuer: 'devglobal-hub',
        audience: 'devglobal-api',
      };

      const decoded = jwt.verify(token, this.accessSecret, options) as TokenPayload;

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.warn('Access token expired');
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        logger.warn('Invalid access token');
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  public verifyRefreshToken(token: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256'],
        issuer: 'devglobal-hub',
        audience: 'devglobal-api',
      };

      const decoded = jwt.verify(token, this.refreshSecret, options) as TokenPayload;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  public verifyResetToken(token: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256'],
        issuer: 'devglobal-hub',
        audience: 'devglobal-api',
      };

      const decoded = jwt.verify(token, this.accessSecret, options) as TokenPayload;

      if (decoded.type !== 'reset') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Reset token expired');
      }
      throw new Error('Invalid reset token');
    }
  }

  public verifyEmailToken(token: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256'],
        issuer: 'devglobal-hub',
        audience: 'devglobal-api',
      };

      const decoded = jwt.verify(token, this.accessSecret, options) as TokenPayload;

      if (decoded.type !== 'verify') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Verification token expired');
      }
      throw new Error('Invalid verification token');
    }
  }
}

export const jwtService = new JWTService();