import { Router } from 'express';
import { LandingController } from './landing.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';

const router = Router();

// Public route
router.get('/', LandingController.getLandingPage);

// Admin route
router.put(
  '/',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  LandingController.updateLandingPage
);

export { router as landingRoutes };