import { IRepository } from '@core';
import { Notification } from '../types';
import { notificationApi } from '../store';

export class NotificationRepository implements IRepository<Notification> {
  async getById(id: string): Promise<Notification> {
    const result = await notificationApi.endpoints.getNotificationById.initiate(id);
    return result.data as Notification;
  }

  async getAll(params?: any): Promise<Notification[]> {
    const result = await notificationApi.endpoints.getNotifications.initiate(params || {});
    const data = result.data as any;
    return data?.data?.items || [];
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    const result = await notificationApi.endpoints.createNotification.initiate(data);
    return result.data as Notification;
  }

  async update(id: string, data: Partial<Notification>): Promise<Notification> {
    const result = await notificationApi.endpoints.updateNotification.initiate({ id, ...data });
    return result.data as Notification;
  }

  async delete(id: string): Promise<void> {
    await notificationApi.endpoints.deleteNotification.initiate(id);
  }

  async markAsRead(id: string): Promise<Notification> {
    const result = await notificationApi.endpoints.markAsRead.initiate(id);
    return result.data as Notification;
  }

  async markAllAsRead(): Promise<void> {
    await notificationApi.endpoints.markAllAsRead.initiate();
  }
}

export const notificationRepository = new NotificationRepository();
