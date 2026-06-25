import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { Request } from 'express';

// Create rate limiters ONCE at module load time, not per-request
const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  keyGenerator: (req: Request) => {
    return req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
  },
  skip: (req: Request) => {
    return req.ip === '127.0.0.1' || req.ip === '::1';
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
    code: 'AUTH_RATE_LIMIT',
  },
  keyGenerator: (req: Request) => {
    return req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
  },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI request limit exceeded. Please wait before making another request.',
    code: 'AI_RATE_LIMIT',
  },
  keyGenerator: (req: Request) => {
    return ((req as any).user?.sub || req.ip) as string;
  },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'API rate limit exceeded.',
    code: 'API_RATE_LIMIT',
  },
  keyGenerator: (req: Request) => {
    return (req.headers['x-api-key'] as string) || req.ip || 'unknown';
  },
});

export class RateLimitMiddleware {
  public static generalLimit() {
    return generalLimiter;
  }

  public static authLimit() {
    return authLimiter;
  }

  public static aiLimit() {
    return aiLimiter;
  }

  public static apiLimit() {
    return apiLimiter;
  }
}