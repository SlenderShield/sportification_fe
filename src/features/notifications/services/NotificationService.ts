import { IService, logger } from '@core';
import { Notification } from '../types';
import { NotificationRepository } from '../repositories/NotificationRepository';

export interface INotificationService extends IService {
  getNotifications(): Promise<Notification[]>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(): Promise<void>;
  deleteNotification(id: string): Promise<void>;
}

export class NotificationService implements INotificationService {
  constructor(private repository: NotificationRepository) {}

  async initialize(): Promise<void> {
    logger.info('NotificationService initialized');
  }

  cleanup(): void {
    logger.info('NotificationService cleanup');
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      return await this.repository.getAll();
    } catch (error) {
      logger.error('Failed to get notifications', error as Error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.repository.getAll({ read: false });
      return notifications.length;
    } catch (error) {
      logger.error('Failed to get unread count', error as Error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const notification = await this.repository.markAsRead(id);
      logger.info('Notification marked as read', { id });
      return notification;
    } catch (error) {
      logger.error('Failed to mark notification as read', error as Error, { id });
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await this.repository.markAllAsRead();
      logger.info('All notifications marked as read');
    } catch (error) {
      logger.error('Failed to mark all as read', error as Error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
      logger.info('Notification deleted', { id });
    } catch (error) {
      logger.error('Failed to delete notification', error as Error, { id });
      throw error;
    }
  }
}

export const notificationService = new NotificationService(new NotificationRepository());
