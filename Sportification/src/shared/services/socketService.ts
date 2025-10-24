import { logger } from '@core';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@core/config';
import { apiService } from './api';
import { Message } from '@features/chat/types';
import { Notification } from '@features/notifications/types';
import { Match } from '@features/matches/types';
import { Tournament } from '@features/tournaments/types';

export type SocketEventCallback = (data: any) => void;

export interface SocketEventHandlers {
  'new_message': (message: Message) => void;
  'message_sent': (message: Message) => void;
  'message_delivered': (data: { messageId: string; deliveredAt: string }) => void;
  'message_read': (data: { messageId: string; readBy: string; readAt: string }) => void;
  'match_updated': (match: Match) => void;
  'match_participant_joined': (data: { matchId: string; participant: any }) => void;
  'match_participant_left': (data: { matchId: string; userId: string }) => void;
  'match_started': (data: { matchId: string; startTime: string }) => void;
  'match_completed': (data: { matchId: string; result: any }) => void;
  'tournament_updated': (tournament: Tournament) => void;
  'tournament_started': (data: { tournamentId: string; startTime: string }) => void;
  'tournament_match_completed': (data: { tournamentId: string; matchId: string; result: any }) => void;
  'notification': (notification: Notification) => void;
  'user_online': (data: { userId: string; timestamp: string }) => void;
  'user_offline': (data: { userId: string; lastSeen: string }) => void;
  'typing_start': (data: { chatId: string; userId: string; username: string }) => void;
  'typing_stop': (data: { chatId: string; userId: string }) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<string, Set<SocketEventCallback>> = new Map();

  async connect(): Promise<void> {
    const token = await apiService.getAccessToken();
    if (!token) {
      logger.warn('No access token available for socket connection');
      return;
    }

    if (this.socket?.connected) {
      logger.log('Socket already connected');
      return;
    }

    this.socket = io(API_CONFIG.SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    });

    this.setupEventListeners();
    this.reattachEventHandlers();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      logger.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      logger.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      logger.error('Socket connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      logger.log('Socket reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      logger.log('Socket reconnection attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      logger.error('Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      logger.error('Socket reconnection failed');
    });
  }

  private reattachEventHandlers(): void {
    if (!this.socket) return;

    this.eventHandlers.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback);
      });
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      setTimeout(() => {
        logger.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect();
      }, delay);
    } else {
      logger.error('Max reconnection attempts reached');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  joinChat(chatId: string): void {
    if (this.socket) {
      this.socket.emit('join_chat', { chatId });
    }
  }

  leaveChat(chatId: string): void {
    if (this.socket) {
      this.socket.emit('leave_chat', { chatId });
    }
  }

  joinMatch(matchId: string): void {
    if (this.socket) {
      this.socket.emit('join_match', { matchId });
    }
  }

  leaveMatch(matchId: string): void {
    if (this.socket) {
      this.socket.emit('leave_match', { matchId });
    }
  }

  joinTournament(tournamentId: string): void {
    if (this.socket) {
      this.socket.emit('join_tournament', { tournamentId });
    }
  }

  leaveTournament(tournamentId: string): void {
    if (this.socket) {
      this.socket.emit('leave_tournament', { tournamentId });
    }
  }

  sendMessage(chatId: string, content: string, type: 'text' | 'image' = 'text', replyTo?: string): void {
    if (this.socket) {
      this.socket.emit('send_message', {
        chatId,
        content,
        messageType: type,
        replyTo,
      });
    }
  }

  startTyping(chatId: string): void {
    if (this.socket) {
      this.socket.emit('typing_start', { chatId });
    }
  }

  stopTyping(chatId: string): void {
    if (this.socket) {
      this.socket.emit('typing_stop', { chatId });
    }
  }

  markMessageAsRead(chatId: string, messageId: string): void {
    if (this.socket) {
      this.socket.emit('mark_message_read', { chatId, messageId });
    }
  }

   
  // eslint-disable-next-line no-dupe-class-members
  on<K extends keyof SocketEventHandlers>(
    event: K,
    callback: SocketEventHandlers[K]
  ): void;
  // eslint-disable-next-line no-dupe-class-members
  on(event: string, callback: SocketEventCallback): void;
  // TypeScript method overload pattern - implementation signature
  // eslint-disable-next-line no-dupe-class-members
  on(event: string, callback: SocketEventCallback): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

   
  // eslint-disable-next-line no-dupe-class-members
  off<K extends keyof SocketEventHandlers>(
    event: K,
    callback?: SocketEventHandlers[K]
  ): void;
  // eslint-disable-next-line no-dupe-class-members
  off(event: string, callback?: SocketEventCallback): void;
  // TypeScript method overload pattern - implementation signature
  // eslint-disable-next-line no-dupe-class-members
  off(event: string, callback?: SocketEventCallback): void {
    if (callback) {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.delete(callback);
        if (handlers.size === 0) {
          this.eventHandlers.delete(event);
        }
      }

      if (this.socket) {
        this.socket.off(event, callback);
      }
    } else {
      this.eventHandlers.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      logger.warn(`Cannot emit event ${event}: Socket not connected`);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();
