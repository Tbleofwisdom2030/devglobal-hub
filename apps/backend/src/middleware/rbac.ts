// Role-based access control
// TODO: Add RBAC middleware
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
}

export class RBACMiddleware {
  public static authorize(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED',
        });
        return;
      }

      const userRole = req.user.role as UserRole;

      if (!allowedRoles.includes(userRole)) {
        logger.warn(
          `Access denied for user ${req.user.email} with role ${userRole}. Required roles: ${allowedRoles.join(', ')}`
        );

        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          code: 'FORBIDDEN',
          details: `Required roles: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      next();
    };
  }

  public static isAdmin(req: Request, res: Response, next: NextFunction): void {
    return RBACMiddleware.authorize(UserRole.ADMIN)(req, res, next);
  }

  public static isAdminOrSupport(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    return RBACMiddleware.authorize(UserRole.ADMIN, UserRole.SUPPORT)(
      req,
      res,
      next
    );
  }

  public static isOwnerOrAdmin(
    paramIdField: string = 'id',
    checkAdmin: boolean = true
  ) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED',
        });
        return;
      }

      const resourceId = req.params[paramIdField];
      const userId = req.user.sub;

      // Admins can access any resource
      if (checkAdmin && req.user.role === UserRole.ADMIN) {
        next();
        return;
      }

      // Check if the resource belongs to the user
      if (resourceId === userId) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        error: 'You can only access your own resources',
        code: 'NOT_OWNER',
      });
    };
  }
}