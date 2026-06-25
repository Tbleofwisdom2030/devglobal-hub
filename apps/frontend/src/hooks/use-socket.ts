'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authUtils } from '@/lib/auth';

const WS_URL = process.env.NEXT_PUBLIC_API_URL 
  ? new URL(process.env.NEXT_PUBLIC_API_URL).origin 
  : 'http://localhost:4000';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authUtils.getAccessToken();
    
    const socket = io(WS_URL, {
      auth: { token },
      transports: ['polling', 'websocket'], // Try polling first
      path: '/socket.io/',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    });

    socket.on('connected', (data) => {
      console.log('✅ Authenticated:', data);
      setIsAuthenticated(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    socket.on('connect_error', (error) => {
      console.warn('⚠️ WebSocket connection error:', error.message);
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = (event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    socketRef.current?.off(event, callback);
  };

  return { 
    socket: socketRef.current, 
    isConnected, 
    isAuthenticated,
    emit, 
    on, 
    off 
  };
}