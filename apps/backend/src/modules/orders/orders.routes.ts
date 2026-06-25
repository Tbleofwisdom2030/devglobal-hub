import { Router } from 'express';
import { OrdersController } from './orders.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { ValidationMiddleware } from '../../middleware/validate';
import { createOrderSchema, orderFilterSchema } from './orders.schema';

const router: Router = Router();

// Protected routes
router.post(
  '/',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(createOrderSchema),
  OrdersController.createOrder
);

router.get(
  '/',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(orderFilterSchema, 'query'),
  OrdersController.listOrders
);

router.get(
  '/:id',
  AuthMiddleware.authenticate,
  OrdersController.getOrder
);

export { router as ordersRoutes };