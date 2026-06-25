// Socket.io server
// TODO: Add socket server
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../config/logger';
import { AuthHandler } from './auth-handler';
import { ChatHandler } from './chat-handler';
import { NotificationHandler } from './notification-handler';
import { jwtService } from '../utils/jwt';

export class SocketServer {
  private io: SocketIOServer;
  private connectedUsers: Map<string, Set<string>> = new Map(); // userId -> Set<socketId>

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  public initialize(): void {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || 
                     socket.handshake.query.token as string;

        if (!token) {
          return next(new Error('Authentication required'));
        }

        const decoded = jwtService.verifyAccessToken(token);
        (socket as any).user = decoded;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      this.handleConnection(socket);
    });

    logger.info('WebSocket server initialized');
  }

  private handleConnection(socket: Socket): void {
    const user = (socket as any).user;
    const userId = user.sub;

    logger.info(`User connected: ${userId} (socket: ${socket.id})`);

    // Track connected users
    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, new Set());
    }
    this.connectedUsers.get(userId)!.add(socket.id);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Join role-based rooms
    if (user.role === 'ADMIN') {
      socket.join('admin');
    }
    if (user.role === 'SUPPORT') {
      socket.join('support');
    }

    // Initialize handlers
    const authHandler = new AuthHandler(socket);
    const chatHandler = new ChatHandler(this.io, socket);
    const notificationHandler = new NotificationHandler(this.io, socket);

    // Register event handlers
    authHandler.register();
    chatHandler.register();
    notificationHandler.register();

    // Handle disconnect
    socket.on('disconnect', () => {
      this.handleDisconnect(socket, userId);
    });

    // Send connection confirmation
    socket.emit('connected', {
      message: 'Connected to DevGlobal Hub',
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  private handleDisconnect(socket: Socket, userId: string): void {
    logger.info(`User disconnected: ${userId} (socket: ${socket.id})`);

    const userSockets = this.connectedUsers.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        this.connectedUsers.delete(userId);
      }
    }
  }

  public getConnectedUsers(): Map<string, Set<string>> {
    return this.connectedUsers;
  }

  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId) && 
           this.connectedUsers.get(userId)!.size > 0;
  }
}