import { Router, type Router as ExpressRouter } from 'express';
import { ChatController } from './chat.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { ValidationMiddleware } from '../../middleware/validate';
import { RateLimitMiddleware } from '../../middleware/rate-limit';
import {
  createConversationSchema,
  sendMessageSchema,
  conversationFilterSchema,
} from './chat.schema';

const router: ExpressRouter = Router();

// Protected routes
router.post(
  '/conversations',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(createConversationSchema),
  ChatController.createConversation
);

router.get(
  '/conversations',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(conversationFilterSchema, 'query'),
  ChatController.listConversations
);

router.get(
  '/conversations/:id',
  AuthMiddleware.authenticate,
  ChatController.getConversation
);

router.post(
  '/conversations/:id/messages',
  AuthMiddleware.authenticate,
  RateLimitMiddleware.aiLimit(),
  ValidationMiddleware.validate(sendMessageSchema),
  ChatController.sendMessage
);

router.delete(
  '/conversations/:id',
  AuthMiddleware.authenticate,
  ChatController.archiveConversation
);

export { router as chatRoutes };