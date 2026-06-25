import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { ErrorHandlerMiddleware } from './middleware/error-handler';
import { RequestLoggerMiddleware } from './middleware/request-logger';
import { RateLimitMiddleware } from './middleware/rate-limit';
import { AuditMiddleware } from './middleware/audit';

// Import routes
import { authRoutes } from './modules/auth/auth.routes';
import { productsRoutes } from './modules/products/products.routes';
import { ordersRoutes } from './modules/orders/orders.routes';
import { licensesRoutes } from './modules/licenses/licenses.routes';
import { ticketsRoutes } from './modules/tickets/tickets.routes';
import { chatRoutes } from './modules/chat/chat.routes';
import { kbRoutes } from './modules/knowledge-base/kb.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { webhooksRoutes } from './modules/webhooks/webhooks.routes';
import { landingRoutes } from './modules/landing/landing.routes';
import { blogRoutes } from './modules/blog/blog.routes';
import { mediaRoutes } from './modules/media/media.routes';
import { settingsRoutes } from './modules/settings/settings.routes';

export function createApp(): express.Express {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet({ 
    contentSecurityPolicy: false, 
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  }));
  app.use(cors({
    origin: env.CORS_ORIGIN.split(',').map(o => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-API-Key'],
    exposedHeaders: ['X-Request-ID'],
    maxAge: 86400,
  }));
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  app.use(RequestLoggerMiddleware.log);

  // ============================================
  // SERVE STATIC FILES - MUST BE BEFORE API ROUTES
  // ============================================
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
      // Set CORS headers for images
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }));
  
  // Also serve from /api/uploads for consistency
  app.use('/api/uploads', express.static(uploadsPath));

  // ============================================
  // RATE LIMITING & AUDIT (only for API routes)
  // ============================================
  app.use('/api/', RateLimitMiddleware.generalLimit());
  app.use('/api/', AuditMiddleware.log);

  // Health check
  app.get('/health', async (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString(), uptime: process.uptime() });
  });

  // API Routes
  const apiRouter = express.Router();
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/products', productsRoutes);
  apiRouter.use('/orders', ordersRoutes);
  apiRouter.use('/licenses', licensesRoutes);
  apiRouter.use('/tickets', ticketsRoutes);
  apiRouter.use('/chat', chatRoutes);
  apiRouter.use('/knowledge', kbRoutes);
  apiRouter.use('/admin', adminRoutes);
  apiRouter.use('/webhooks', webhooksRoutes);
  apiRouter.use('/landing', landingRoutes);
  apiRouter.use('/blog', blogRoutes);
  apiRouter.use('/media', mediaRoutes);
  apiRouter.use('/site-settings', settingsRoutes);

  app.use('/api/v1', apiRouter);
  
  // 404 handler for API routes
  app.use('/api/', ErrorHandlerMiddleware.notFound);
  
  // Global error handler
  app.use(ErrorHandlerMiddleware.handle);

  return app;
}