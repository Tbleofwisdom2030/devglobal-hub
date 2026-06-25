import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import { logger } from '../../config/logger';

export class OrdersController {
  public static async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await OrdersService.createOrder(req.user!.sub, req.body);

      res.status(201).json({
        success: true,
        message: 'Checkout session created',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async listOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, status } = req.query;

      const result = await OrdersService.listUserOrders(
        req.user!.sub,
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10,
        status as string
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const order = await OrdersService.getOrderById(
        req.params.id,
        req.user!.sub
      );

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}