import { StripeService } from '../../services/stripe-service';
import { OrdersService } from '../orders/orders.service';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

export class WebhooksService {
  public static async handleStripeWebhook(
    signature: string,
    payload: Buffer
  ) {
    try {
      // Verify webhook signature
      const event = await StripeService.verifyWebhookSignature(
        payload,
        signature
      );

      logger.info(`Stripe webhook received: ${event.type}`);

      // Process the event
      await OrdersService.handleStripeWebhook(event);

      return { received: true, type: event.type };
    } catch (error) {
      logger.error(`Stripe webhook error: ${String(error)}`);
      throw error;
    }
  }
}