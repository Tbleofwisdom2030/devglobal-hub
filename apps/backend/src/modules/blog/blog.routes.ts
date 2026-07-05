import { Router } from 'express';
import { BlogController } from './blog.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';
import { ValidationMiddleware } from '../../middleware/validate';
import { createBlogSchema, updateBlogSchema } from './blog.schema';

const router: Router = Router();

// Public routes
router.get('/', BlogController.listPosts);
router.get('/:slug', BlogController.getPost);

// Admin routes - list all (including drafts)
router.get('/admin/all', AuthMiddleware.authenticate, RBACMiddleware.isAdmin, BlogController.listPosts);

// Create
router.post(
  '/',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ValidationMiddleware.validate(createBlogSchema),
  BlogController.createPost
);

// Update
router.put(
  '/:id',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ValidationMiddleware.validate(updateBlogSchema),
  BlogController.updatePost
);

// Delete
router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  BlogController.deletePost
);

export { router as blogRoutes };