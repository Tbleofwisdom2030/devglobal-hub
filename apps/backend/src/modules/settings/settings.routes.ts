import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';

const router: Router = Router();

router.get('/', SettingsController.getSettings);
router.put(
  '/',
  AuthMiddleware.authenticate,
  RBACMiddleware.isAdmin,
  SettingsController.updateSettings
);

export { router as settingsRoutes };