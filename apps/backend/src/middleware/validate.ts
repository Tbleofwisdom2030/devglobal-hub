// Zod validation
// TODO: Add validation middleware
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export class ValidationMiddleware {
  public static validate(
    schema: ZodSchema,
    target: ValidationTarget = 'body'
  ) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const data = schema.parse(req[target]);
        
        // Replace request data with validated data
        req[target] = data;
        
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          }));

          res.status(400).json({
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: formattedErrors,
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: 'Invalid request data',
          code: 'INVALID_REQUEST',
        });
      }
    };
  }
}