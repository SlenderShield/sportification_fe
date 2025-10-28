import { logger } from '@core';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

class NotificationService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    if (Platform.OS === 'web') {
      logger.log('Notification service not supported on web platform');
      return;
    }

    try {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }
      
      await this.requestPermission();
      await this.setupNotificationHandlers();
      this.initialized = true;
    } catch (error) {
      logger.error('Failed to initialize notification service:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        logger.log('Notification permission granted:', authStatus);
      } else {
        logger.log('Notification permission denied');
      }

      return enabled;
    } catch (error) {
      logger.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const token = await messaging().getToken();
      logger.log('FCM Token:', token);
      return token;
    } catch (error) {
      logger.error('Error getting FCM token:', error);
      return null;
    }
  }

  async setupNotificationHandlers() {
    if (Platform.OS === 'web') return;

    messaging().onMessage(async (remoteMessage) => {
      logger.log('Foreground message received:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      logger.log('Background event:', type, detail);
      if (type === EventType.PRESS) {
        logger.log('User pressed notification:', detail.notification);
      }
    });

    notifee.onForegroundEvent(({ type, detail }) => {
      logger.log('Foreground event:', type, detail);
      if (type === EventType.PRESS) {
        logger.log('User pressed notification:', detail.notification);
      }
    });
  }

  async displayNotification(remoteMessage: any) {
    if (Platform.OS === 'web') return;

    try {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
      });
    } catch (error) {
      logger.error('Error displaying notification:', error);
    }
  }

  async sendTokenToServer(token: string) {
    logger.log('TODO: Send FCM token to backend:', token);
  }

  onTokenRefresh(callback: (token: string) => void) {
    if (Platform.OS === 'web') return () => {};

    return messaging().onTokenRefresh((token) => {
      logger.log('FCM Token refreshed:', token);
      callback(token);
    });
  }
}

export const notificationService = new NotificationService();
