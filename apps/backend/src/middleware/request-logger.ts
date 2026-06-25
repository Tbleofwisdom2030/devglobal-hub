// Request/response logging
// TODO: Add request logging
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

export class RequestLoggerMiddleware {
  public static log(req: Request, res: Response, next: NextFunction): void {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    const startTime = Date.now();

    // Attach request ID
    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);

    // Log request
    logger.info({
      type: 'request',
      requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: (req as any).user?.sub,
      body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
    });

    // Capture response
    const originalSend = res.json.bind(res);
    res.json = function (body: any) {
      const duration = Date.now() - startTime;

      logger.info({
        type: 'response',
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.getHeader('content-length'),
      });

      // Log errors
      if (res.statusCode >= 400) {
        logger.warn({
          type: 'error_response',
          requestId,
          statusCode: res.statusCode,
          body: body,
        });
      }

      return originalSend(body);
    };

    next();
  }
}

function sanitizeBody(body: any): any {
  if (!body) return body;

  const sanitized = { ...body };
  const sensitiveFields = [
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'creditCard',
    'cvv',
  ];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}