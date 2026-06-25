import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { database } from './config/database';
import { redisConnection } from './config/redis';
import { SocketServer } from './websocket/socket-server';

class Server {
  private httpServer: http.Server;
  private io: SocketIOServer;
  private isShuttingDown: boolean = false;

  constructor() {
    const app = createApp();
    this.httpServer = http.createServer(app);
    
    // Set up Socket.io with the HTTP server
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      maxHttpBufferSize: 1e6, // 1MB
      path: '/socket.io/',
    });

    // Log Socket.io connections
    this.io.engine.on('connection_error', (err) => {
      logger.error('Socket.io connection error:', err);
    });
  }

  public async start(): Promise<void> {
    try {
      logger.info('🚀 Starting DevGlobal Hub Server...');

      // Connect to database
      try {
        await database.connect();
        logger.info('✅ Database connected');
      } catch (error) {
        logger.warn('⚠️ Database connection failed - some features may not work');
        logger.warn('Error details:', error);
      }

      // Check Redis
      try {
        await redisConnection.healthCheck();
        logger.info('✅ Redis connected');
      } catch (error) {
        logger.warn('⚠️ Redis not available - background jobs will not work');
      }

      // Initialize WebSocket server
      const socketServer = new SocketServer(this.io);
      socketServer.initialize();
      logger.info('✅ WebSocket server initialized');

      // Start HTTP server
      const port = env.PORT;
      this.httpServer.listen(port, env.HOST, () => {
        logger.info(`✅ Server running on http://${env.HOST}:${port}`);
        logger.info(`✅ Health check: http://${env.HOST}:${port}/health`);
        logger.info(`✅ API Base: http://${env.HOST}:${port}/api/v1`);
        logger.info(`✅ WebSocket: ws://${env.HOST}:${port}/socket.io/`);
        logger.info(`🌍 Environment: ${env.NODE_ENV}`);
        logger.info(`🤖 AI Features: ${env.ENABLE_AI_FEATURES ? 'Enabled' : 'Disabled'}`);
      });

      // Graceful shutdown handlers
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;

      logger.info(`🛑 Received ${signal}. Starting graceful shutdown...`);

      // Stop accepting new connections
      this.httpServer.close(() => {
        logger.info('HTTP server closed');
      });

      // Close WebSocket connections
      this.io.close(() => {
        logger.info('WebSocket server closed');
      });

      // Disconnect from Redis
      try {
        await redisConnection.disconnect();
        logger.info('Redis disconnected');
      } catch (e) {}

      // Disconnect from database
      try {
        await database.disconnect();
        logger.info('Database disconnected');
      } catch (e) {}

      logger.info('✅ Graceful shutdown complete');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      shutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection:', reason);
    });
  }
}

// Start server
const server = new Server();
server.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export { Server };