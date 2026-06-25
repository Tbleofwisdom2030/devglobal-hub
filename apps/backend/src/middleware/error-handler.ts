// Global error handler
// TODO: Add error handling
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class ValidationError extends AppError {
  public details: any[];

  constructor(message: string = 'Validation failed', details: any[] = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class ErrorHandlerMiddleware {
  public static handle(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    // Log error
    logger.error({
      err: error,
      requestId: req.headers['x-request-id'],
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: (req as any).user?.sub,
    });

    // Handle known operational errors
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
        code: error.code,
        ...(error instanceof ValidationError && { details: error.details }),
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack,
        }),
      });
      return;
    }

    // Handle Prisma errors
    if (error instanceof PrismaClientKnownRequestError) {
      const prismaError = error as PrismaClientKnownRequestError;
      switch (prismaError.code) {
        case 'P2002':
          const target = (prismaError.meta?.target as string[]) || [];
          res.status(409).json({
            success: false,
            error: `Unique constraint violation on: ${target.join(', ')}`,
            code: 'UNIQUE_CONSTRAINT',
          });
          return;

        case 'P2025':
          res.status(404).json({
            success: false,
            error: 'Record not found',
            code: 'NOT_FOUND',
          });
          return;

        case 'P2003':
          res.status(400).json({
            success: false,
            error: 'Foreign key constraint violation',
            code: 'FOREIGN_KEY_ERROR',
          });
          return;

        default:
          res.status(400).json({
            success: false,
            error: 'Database error',
            code: 'DATABASE_ERROR',
            prismaCode: prismaError.code,
          });
          return;
      }
    }

    if (error instanceof PrismaClientValidationError) {
      res.status(400).json({
        success: false,
        error: 'Invalid database query',
        code: 'INVALID_QUERY',
      });
      return;
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      res.status(400).json({
        success: false,
        error: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: formattedErrors,
      });
      return;
    }

    // Handle Stripe errors
    const stripeError = error as Error & { type?: string; code?: string };
    if (stripeError.type && stripeError.type.startsWith('Stripe')) {
      res.status(402).json({
        success: false,
        error: stripeError.message || 'Payment processing error',
        code: 'STRIPE_ERROR',
        stripeCode: stripeError.code,
      });
      return;
    }

    // Handle unknown errors
    const isProduction = process.env.NODE_ENV === 'production';

    res.status(500).json({
      success: false,
      error: isProduction
        ? 'An unexpected error occurred'
        : error.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }

  public static notFound(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    res.status(404).json({
      success: false,
      error: `Route ${req.method} ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND',
    });
  }
}