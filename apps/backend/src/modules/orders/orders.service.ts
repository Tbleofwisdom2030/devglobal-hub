import { prisma } from '../../config/database';

import { logger } from '../../config/logger';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { NotFoundError, AppError } from '../../middleware/error-handler';
import { StripeService } from '../../services/stripe-service';
import { CreateOrderDTO } from './orders.types';
import { env } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';

export class OrdersService {
  public static async createOrder(
    userId: string,
    data: CreateOrderDTO
  ): Promise<{ checkoutUrl: string; orderId: string }> {
    // Get product
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundError('Product');
    }

    if (!product.isActive) {
      throw new AppError('Product is not available', 400, 'PRODUCT_INACTIVE');
    }

    // Check if user already has an active license
    const existingLicense = await prisma.license.findFirst({
      where: {
        userId,
        productId: product.id,
        status: 'ACTIVE',
      },
    });

    if (existingLicense) {
      throw new AppError(
        'You already have an active license for this product',
        400,
        'LICENSE_EXISTS'
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        userId,
        productId: product.id,
        amountCents: product.priceCents,
        currency: product.currency,
        status: 'PENDING',
        metadata: data.metadata || {},
      },
    });

    // Create Stripe checkout session
    try {
      const session = await StripeService.createCheckoutSession({
        orderId: order.id,
        userId,
        productName: product.name,
        productDescription: product.description || '',
        amountCents: product.priceCents,
        currency: product.currency,
        successUrl: data.successUrl || `${env.CORS_ORIGIN}/dashboard/orders?success=true`,
        cancelUrl: data.cancelUrl || `${env.CORS_ORIGIN}/products/${product.slug}?canceled=true`,
        metadata: {
          orderId: order.id,
          userId,
          productId: product.id,
        },
      });

      // Update order with Stripe session ID
      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
      });

      return {
        checkoutUrl: session.url!,
        orderId: order.id,
      };
    } catch (error) {
      // Mark order as failed
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });

      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to create Stripe checkout session: ${errorMessage}`);
      throw new AppError('Failed to create checkout session', 500, 'STRIPE_ERROR');
    }
  }

  public static async listUserOrders(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<PaginatedResponse<any>> {
    const where: any = { userId };

    if (status) {
      where.status = status as any;
    }

    const { orderBy: _orderBy, ...paginationParams } = PaginationHelper.getPaginationParams({ page, limit });

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              imageUrls: true,
            },
          },
          license: {
            select: {
              licenseKey: true,
              status: true,
            },
          },
        },
        ...paginationParams,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return PaginationHelper.createPaginatedResponse(orders, total, { page, limit });
  }

  public static async getOrderById(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    
    if (userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            description: true,
            imageUrls: true,
            version: true,
          },
        },
        license: {
          select: {
            licenseKey: true,
            status: true,
            maxActivations: true,
            activationCount: true,
            expiresAt: true,
          },
        },
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError('Order');
    }

    return order;
  }

  public static async handleStripeWebhook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object);
        break;
      case 'checkout.session.expired':
        await this.handleCheckoutExpired(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await this.handleRefund(event.data.object);
        break;
      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }
  }

  private static async handleCheckoutCompleted(session: any) {
    const { orderId, userId, productId } = session.metadata;

    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        stripePaymentId: session.payment_intent,
      },
    });

    // Generate license
    const { LicenseService } = require('../licenses/licenses.service');
    await LicenseService.generateLicense(orderId, userId, productId);

    logger.info(`Order completed: ${orderId}`);
  }

  private static async handleCheckoutExpired(session: any) {
    const { orderId } = session.metadata;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'FAILED' },
    });

    logger.info(`Checkout expired for order: ${orderId}`);
  }

  private static async handlePaymentFailed(paymentIntent: any) {
    logger.warn(`Payment failed: ${paymentIntent.id}`);
  }

  private static async handleRefund(charge: any) {
    logger.info(`Refund processed: ${charge.id}`);
  }
}