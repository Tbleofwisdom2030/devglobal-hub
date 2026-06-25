import { Router } from 'express';
import { TicketsController } from './tickets.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';
import { ValidationMiddleware } from '../../middleware/validate';
import { RateLimitMiddleware } from '../../middleware/rate-limit';
import {
  createTicketSchema,
  updateTicketSchema,
  addMessageSchema,
  ticketFilterSchema,
} from './tickets.schema';

const router: Router = Router();

// Protected routes
router.post(
  '/',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(createTicketSchema),
  TicketsController.createTicket
);

router.get(
  '/',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(ticketFilterSchema, 'query'),
  TicketsController.listTickets
);

router.get(
  '/similar',
  AuthMiddleware.authenticate,
  TicketsController.findSimilarTickets
);

router.get(
  '/:id',
  AuthMiddleware.authenticate,
  TicketsController.getTicket
);

router.put(
  '/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(updateTicketSchema),
  TicketsController.updateTicket
);

router.post(
  '/:id/messages',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(addMessageSchema),
  TicketsController.addMessage
);

router.get(
  '/:id/ai-summary',
  AuthMiddleware.authenticate,
  RateLimitMiddleware.aiLimit(),
  TicketsController.getAISummary
);

// Admin/Support routes
router.get(
  '/admin/all',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdminOrSupport,
  ValidationMiddleware.validate(ticketFilterSchema, 'query'),
  TicketsController.listAllTickets
);

router.post(
  '/:id/assign',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdminOrSupport,
  TicketsController.assignTicket
);

export { router as ticketsRoutes };