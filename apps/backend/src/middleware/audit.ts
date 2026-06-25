// Audit logging
// TODO: Add audit logging
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export class AuditMiddleware {
  public static async log(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Only log mutations
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      next();
      return;
    }

    const originalJson = res.json.bind(res);
    
    res.json = function (body: any) {
      // Only log successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        AuditMiddleware.createAuditLog(req, body).catch((error) => {
          logger.error({ error }, 'Failed to create audit log');
        });
      }

      return originalJson(body);
    };

    next();
  }

  private static async createAuditLog(
    req: Request,
    responseBody: any
  ): Promise<void> {
    const userId = (req as any).user?.sub;
    const entityId = this.extractEntityId(req);
    const entityType = this.extractEntityType(req);

    if (!entityType) return;

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action: `${req.method} ${req.baseUrl}${req.path}`,
        entityType,
        entityId: entityId || 'unknown',
        newValues: responseBody?.data || null,
        ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
        userAgent: req.headers['user-agent'] || null,
      },
    });
  }

  private static extractEntityType(req: Request): string | null {
    const path = req.baseUrl + req.path;
    
    if (path.includes('/auth')) return 'auth';
    if (path.includes('/products')) return 'product';
    if (path.includes('/orders')) return 'order';
    if (path.includes('/licenses')) return 'license';
    if (path.includes('/tickets')) return 'ticket';
    if (path.includes('/chat')) return 'chat';
    if (path.includes('/knowledge')) return 'knowledge_base';
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/webhooks')) return 'webhook';
    
    return null;
  }

  private static extractEntityId(req: Request): string | null {
    const path = req.path;
    const parts = path.split('/');
    
    // Try to find UUID in path
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    for (const part of parts) {
      if (uuidPattern.test(part)) {
        return part;
      }
    }
    
    return null;
  }
}