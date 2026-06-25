import { Request, Response, NextFunction } from 'express';
import { WebhooksService } from './webhooks.service';
import { logger } from '../../config/logger';

export class WebhooksController {
  public static async handleStripeWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        res.status(400).json({
          success: false,
          error: 'Missing Stripe signature',
          code: 'MISSING_SIGNATURE',
        });
        return;
      }

      const result = await WebhooksService.handleStripeWebhook(
        signature,
        req.body
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Webhook processing failed:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Webhook processing failed',
        code: 'WEBHOOK_ERROR',
      });
    }
  }
}