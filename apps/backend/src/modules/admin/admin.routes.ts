import { Router } from 'express';
import { AdminController } from './admin.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { RBACMiddleware } from '../../middleware/rbac';
import { ValidationMiddleware } from '../../middleware/validate';
import { z } from 'zod';

const router: Router = Router();

router.use(AuthMiddleware.authenticate);
router.use(RBACMiddleware.isAdmin);

// Dashboard
router.get('/dashboard/stats', AdminController.getDashboardStats);

// Notifications
router.get('/notifications', (AdminController as any).getNotifications);

// Users
router.get('/users', AdminController.listUsers);
router.put('/users/:id/role', ValidationMiddleware.validate(z.object({ role: z.enum(['CUSTOMER', 'ADMIN', 'SUPPORT']) })), AdminController.updateUserRole);
router.put('/users/:id/verify', (AdminController as any).verifyUser);

// Analytics
router.get('/analytics/sales', AdminController.getSalesAnalytics);

// AI Insights
router.get('/ai-insights', AdminController.getAIInsights);

export { router as adminRoutes };