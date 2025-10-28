import { IRepository } from '@core';
import { Chat, Message } from '../types';
import { chatApi } from '../store';

export class ChatRepository implements IRepository<Chat> {
  async getById(id: string): Promise<Chat> {
    const result = await chatApi.endpoints.getChatById.initiate(id);
    return result.data as Chat;
  }

  async getAll(params?: any): Promise<Chat[]> {
    const result = await chatApi.endpoints.getChats.initiate(params || {});
    const data = result.data as any;
    return data?.data?.items || [];
  }

  async create(data: Partial<Chat>): Promise<Chat> {
    const result = await chatApi.endpoints.createChat.initiate(data);
    return result.data as Chat;
  }

  async update(id: string, data: Partial<Chat>): Promise<Chat> {
    const result = await chatApi.endpoints.updateChat.initiate({ id, ...data });
    return result.data as Chat;
  }

  async delete(id: string): Promise<void> {
    await chatApi.endpoints.deleteChat.initiate(id);
  }

  async sendMessage(chatId: string, message: string): Promise<Message> {
    const result = await chatApi.endpoints.sendMessage.initiate({ chatId, message });
    return result.data as Message;
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const result = await chatApi.endpoints.getMessages.initiate(chatId);
    const data = result.data as any;
    return data?.data?.items || [];
  }
}

export const chatRepository = new ChatRepository();
