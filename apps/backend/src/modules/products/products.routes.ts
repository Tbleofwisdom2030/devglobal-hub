import { Router } from 'express';
import { ProductsController } from './products.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';
import { ValidationMiddleware } from '../../middleware/validate';
import {
  createProductSchema,
  updateProductSchema,
  productFilterSchema,
} from './products.schema';

const router: Router = Router();

// Public routes
router.get(
  '/',
  ValidationMiddleware.validate(productFilterSchema, 'query'),
  ProductsController.listProducts
);

// IMPORTANT: Put specific routes BEFORE parameterized routes!
router.get(
  '/by-id/:id',
  ProductsController.getProductById
);

router.get(
  '/:slug',
  ProductsController.getProductBySlug
);

// Admin routes
router.post(
  '/',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ValidationMiddleware.validate(createProductSchema),
  ProductsController.createProduct
);

router.put(
  '/:id',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ValidationMiddleware.validate(updateProductSchema),
  ProductsController.updateProduct
);

router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ProductsController.deleteProduct
);

export { router as productsRoutes };