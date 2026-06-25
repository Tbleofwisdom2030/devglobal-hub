// Stripe payment integration
// TODO: Add Stripe service
import Stripe from 'stripe';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class StripeService {
  private static stripe: Stripe | null = null;

  private static getClient(): Stripe {
    if (!StripeService.stripe && env.STRIPE_SECRET_KEY) {
      StripeService.stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20' as any,
        typescript: true,
      });
    }
    if (!StripeService.stripe) {
      throw new Error('Stripe is not configured');
    }
    return StripeService.stripe;
  }

  public static async createCheckoutSession(params: {
    orderId: string;
    userId: string;
    productName: string;
    productDescription: string;
    amountCents: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    const stripe = StripeService.getClient();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: params.currency.toLowerCase(),
            product_data: {
              name: params.productName,
              description: params.productDescription,
            },
            unit_amount: params.amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
      customer_email: undefined, // Will be set by Stripe
    });

    logger.info(`Stripe checkout session created: ${session.id}`);

    return session;
  }

  public static async verifyWebhookSignature(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    const stripe = StripeService.getClient();

    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Stripe webhook secret is not configured');
    }

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );

      return event;
    } catch (error) {
      logger.error({ err: error }, 'Stripe webhook signature verification failed');
      throw error;
    }
  }

  public static async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    const stripe = StripeService.getClient();
    return stripe.checkout.sessions.retrieve(sessionId);
  }

  public static async createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    const stripe = StripeService.getClient();
    return stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount }),
    });
  }
}