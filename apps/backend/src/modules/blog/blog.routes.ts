import { Router } from 'express';
import { BlogController } from './blog.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';
import { ValidationMiddleware } from '../../middleware/validate';
import { createBlogSchema, updateBlogSchema, addCommentSchema } from './blog.schema';

const router = Router();

// Public routes
router.get('/', BlogController.listPosts);
router.get('/:slug', BlogController.getPost);
router.get('/:id/comments', BlogController.getComments);

// Authenticated routes
router.post('/:id/like', AuthMiddleware.authenticate, BlogController.likePost);
router.post('/:id/comments', AuthMiddleware.authenticate, ValidationMiddleware.validate(addCommentSchema), BlogController.addComment);

// Admin routes
router.get('/admin/all', AuthMiddleware.authenticate, RBACMiddleware.isAdmin, BlogController.adminListPosts);
router.post('/', AuthMiddleware.authenticate, RBACMiddleware.isAdmin, ValidationMiddleware.validate(createBlogSchema), BlogController.createPost);
router.put('/:id', AuthMiddleware.authenticate, RBACMiddleware.isAdmin, ValidationMiddleware.validate(updateBlogSchema), BlogController.updatePost);
router.delete('/:id', AuthMiddleware.authenticate, RBACMiddleware.isAdmin, BlogController.deletePost);

export { router as blogRoutes };