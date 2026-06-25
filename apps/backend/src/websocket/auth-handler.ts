// Socket authentication
// TODO: Add socket auth
import { Socket } from 'socket.io';
import { logger } from '../config/logger';

export class AuthHandler {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public register(): void {
    this.socket.on('auth:status', () => {
      this.handleStatus();
    });

    this.socket.on('auth:logout', () => {
      this.handleLogout();
    });
  }

  private handleStatus(): void {
    const user = (this.socket as any).user;
    
    this.socket.emit('auth:status', {
      authenticated: true,
      user: {
        id: user.sub,
        email: user.email,
        role: user.role,
      },
    });
  }

  private handleLogout(): void {
    const user = (this.socket as any).user;
    logger.info(`User logging out via WebSocket: ${user.sub}`);
    
    this.socket.emit('auth:loggedOut', {
      message: 'Logged out successfully',
    });
    
    this.socket.disconnect(true);
  }
}