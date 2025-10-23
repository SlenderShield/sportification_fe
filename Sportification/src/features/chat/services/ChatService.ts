import { IService, BusinessError, logger } from '@core';
import { Chat, Message } from '../types';
import { ChatRepository } from '../repositories/ChatRepository';

export interface IChatService extends IService {
  getChats(): Promise<Chat[]>;
  getChatById(id: string): Promise<Chat>;
  createChat(participantIds: string[]): Promise<Chat>;
  sendMessage(chatId: string, message: string): Promise<Message>;
  getMessages(chatId: string): Promise<Message[]>;
}

export class ChatService implements IChatService {
  constructor(private repository: ChatRepository) {}

  async initialize(): Promise<void> {
    logger.info('ChatService initialized');
  }

  cleanup(): void {
    logger.info('ChatService cleanup');
  }

  async getChats(): Promise<Chat[]> {
    try {
      return await this.repository.getAll();
    } catch (error) {
      logger.error('Failed to get chats', error as Error);
      throw error;
    }
  }

  async getChatById(id: string): Promise<Chat> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      logger.error('Failed to get chat', error as Error, { id });
      throw error;
    }
  }

  async createChat(participantIds: string[]): Promise<Chat> {
    try {
      if (!participantIds || participantIds.length < 2) {
        throw new BusinessError('Chat must have at least 2 participants');
      }

      const chat = await this.repository.create({ participants: participantIds } as any);
      logger.info('Chat created', { chatId: chat.id });
      return chat;
    } catch (error) {
      logger.error('Failed to create chat', error as Error, { participantIds });
      throw error;
    }
  }

  async sendMessage(chatId: string, message: string): Promise<Message> {
    try {
      if (!message || message.trim().length === 0) {
        throw new BusinessError('Message cannot be empty');
      }

      const sentMessage = await this.repository.sendMessage(chatId, message);
      logger.info('Message sent', { chatId, messageId: sentMessage.id });
      return sentMessage;
    } catch (error) {
      logger.error('Failed to send message', error as Error, { chatId });
      throw error;
    }
  }

  async getMessages(chatId: string): Promise<Message[]> {
    try {
      return await this.repository.getMessages(chatId);
    } catch (error) {
      logger.error('Failed to get messages', error as Error, { chatId });
      throw error;
    }
  }
}

export const chatService = new ChatService(new ChatRepository());
