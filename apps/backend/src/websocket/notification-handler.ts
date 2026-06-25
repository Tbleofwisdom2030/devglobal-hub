// Notifications
// TODO: Add notification handler
import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../config/logger';

export class NotificationHandler {
  private io: SocketIOServer;
  private socket: Socket;

  constructor(io: SocketIOServer, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  public register(): void {
    this.socket.on('notification:subscribe', (channels: string[]) => {
      this.handleSubscribe(channels);
    });

    this.socket.on('notification:unsubscribe', (channels: string[]) => {
      this.handleUnsubscribe(channels);
    });

    this.socket.on('notification:markRead', (notificationId: string) => {
      this.handleMarkRead(notificationId);
    });
  }

  private handleSubscribe(channels: string[]): void {
    const user = (this.socket as any).user;

    channels.forEach((channel) => {
      const room = `notifications:${user.sub}:${channel}`;
      this.socket.join(room);
      logger.info(`User ${user.sub} subscribed to ${channel}`);
    });

    this.socket.emit('notification:subscribed', { channels });
  }

  private handleUnsubscribe(channels: string[]): void {
    const user = (this.socket as any).user;

    channels.forEach((channel) => {
      const room = `notifications:${user.sub}:${channel}`;
      this.socket.leave(room);
    });

    this.socket.emit('notification:unsubscribed', { channels });
  }

  private handleMarkRead(notificationId: string): void {
    const user = (this.socket as any).user;
    
    // Could update database to mark notification as read
    this.socket.emit('notification:markedRead', { notificationId });
  }

  // Static method to send notification to a user
  public static sendNotification(
    io: SocketIOServer,
    userId: string,
    channel: string,
    data: any
  ): void {
    const room = `notifications:${userId}:${channel}`;
    io.to(room).emit('notification', {
      channel,
      data,
      timestamp: new Date().toISOString(),
    });

    logger.info(`Notification sent to user ${userId} on channel ${channel}`);
  }

  // Send to all admins
  public static sendAdminNotification(
    io: SocketIOServer,
    channel: string,
    data: any
  ): void {
    io.to('admin').emit('notification', {
      channel,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Send to all support agents
  public static sendSupportNotification(
    io: SocketIOServer,
    channel: string,
    data: any
  ): void {
    io.to('support').emit('notification', {
      channel,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}