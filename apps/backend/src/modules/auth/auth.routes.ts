import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { ValidationMiddleware } from '../../middleware/validate';
import { RateLimitMiddleware } from '../../middleware/rate-limit';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
  refreshTokenSchema,
} from './auth.schema';

const router: Router = Router();

// Rate limit auth endpoints
router.use(RateLimitMiddleware.authLimit());

// Public routes
router.post(
  '/register',
  ValidationMiddleware.validate(registerSchema),
  AuthController.register
);

router.post(
  '/login',
  ValidationMiddleware.validate(loginSchema),
  AuthController.login
);

router.post(
  '/refresh',
  ValidationMiddleware.validate(refreshTokenSchema),
  AuthController.refreshToken
);

router.post(
  '/logout',
  AuthMiddleware.authenticate,
  AuthController.logout
);

router.post(
  '/forgot-password',
  ValidationMiddleware.validate(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  ValidationMiddleware.validate(resetPasswordSchema),
  AuthController.resetPassword
);

router.post(
  '/verify-email',
  ValidationMiddleware.validate(verifyEmailSchema),
  AuthController.verifyEmail
);

// Protected routes
router.get(
  '/me',
  AuthMiddleware.authenticate,
  AuthController.getProfile
);

router.put(
  '/me',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(updateProfileSchema),
  AuthController.updateProfile
);

router.put(
  '/change-password',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(changePasswordSchema),
  AuthController.changePassword
);

export { router as authRoutes };