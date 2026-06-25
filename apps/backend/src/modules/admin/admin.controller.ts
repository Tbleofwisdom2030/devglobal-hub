import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { logger } from '../../config/logger';

export class AdminController {
  public static async getDashboardStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async listUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, search } = req.query;

      const result = await AdminService.listUsers(
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10,
        search as string
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateUserRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await AdminService.updateUserRole(
        req.params.id,
        req.body.role
      );

      res.json({
        success: true,
        message: 'User role updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getSalesAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const analytics = await AdminService.getSalesAnalytics();

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAIInsights(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const insights = await AdminService.getAIInsights();

      res.json({
        success: true,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  }
}