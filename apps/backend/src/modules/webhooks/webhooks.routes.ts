import { Router, raw } from 'express';
import { WebhooksController } from './webhooks.controller';

const router: Router = Router();

// Stripe webhook requires raw body for signature verification
router.post(
  '/stripe',
  raw({ type: 'application/json' }),
  WebhooksController.handleStripeWebhook
);

export { router as webhooksRoutes };