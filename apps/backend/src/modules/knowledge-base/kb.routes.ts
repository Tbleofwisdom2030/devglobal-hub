import { Router } from 'express';
import { KnowledgeBaseController } from './kb.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';
import { ValidationMiddleware } from '../../middleware/validate';
import { RateLimitMiddleware } from '../../middleware/rate-limit';
import {
  createArticleSchema,
  updateArticleSchema,
  searchSchema,
  articleFilterSchema,
} from './kb.schema';

const router: Router = Router();

// Public routes
router.get(
  '/',
  ValidationMiddleware.validate(articleFilterSchema, 'query'),
  KnowledgeBaseController.listArticles
);

router.get(
  '/:slug',
  KnowledgeBaseController.getArticle
);

router.post(
  '/search',
  RateLimitMiddleware.aiLimit(),
  ValidationMiddleware.validate(searchSchema),
  KnowledgeBaseController.search
);

// Admin routes
router.post(
  '/',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ValidationMiddleware.validate(createArticleSchema),
  KnowledgeBaseController.createArticle
);

router.put(
  '/:id',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ValidationMiddleware.validate(updateArticleSchema),
  KnowledgeBaseController.updateArticle
);

router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  KnowledgeBaseController.deleteArticle
);

router.post(
  '/:id/embed',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  KnowledgeBaseController.generateEmbeddings
);

export { router as kbRoutes };