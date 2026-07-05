import { Router } from 'express';
import { BlogController } from './blog.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';
import { ValidationMiddleware } from '../../middleware/validate';

const router: Router = Router();

// Public routes
router.get('/', BlogController.listPosts);
router.get('/:slug', BlogController.getPost);

// Admin routes
router.post(
  '/',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ValidationMiddleware.validate({} as any),
  BlogController.createPost
);

router.put(
  '/:id',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  BlogController.updatePost
);

router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  BlogController.deletePost
);

export { router as blogRoutes };