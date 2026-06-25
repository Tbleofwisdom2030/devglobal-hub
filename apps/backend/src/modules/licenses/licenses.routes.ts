import { Router } from 'express';
import { LicensesController } from './licenses.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';
import { ValidationMiddleware } from '../../middleware/validate';
import { RateLimitMiddleware } from '../../middleware/rate-limit';
import {
  validateLicenseSchema,
  activateLicenseSchema,
  revokeLicenseSchema,
} from './licenses.schema';

const router: Router = Router();

// API route for license validation (rate limited)
router.post(
  '/validate',
  RateLimitMiddleware.apiLimit(),
  ValidationMiddleware.validate(validateLicenseSchema),
  LicensesController.validateLicense
);

// Protected routes
router.get(
  '/',
  AuthMiddleware.authenticate,
  LicensesController.listLicenses
);

router.get(
  '/:id',
  AuthMiddleware.authenticate,
  LicensesController.getLicense
);

router.post(
  '/:id/activate',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(activateLicenseSchema),
  LicensesController.activateLicense
);

// Admin routes
router.post(
  '/:id/revoke',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  ValidationMiddleware.validate(revokeLicenseSchema),
  LicensesController.revokeLicense
);

export { router as licensesRoutes };