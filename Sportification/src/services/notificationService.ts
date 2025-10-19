import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

class NotificationService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    if (Platform.OS === 'web') {
      console.log('Notification service not supported on web platform');
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
      console.error('Failed to initialize notification service:', error);
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
        console.log('Notification permission granted:', authStatus);
      } else {
        console.log('Notification permission denied');
      }

      return enabled;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') return null;

    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  async setupNotificationHandlers() {
    if (Platform.OS === 'web') return;

    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      await this.displayNotification(remoteMessage);
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('Background event:', type, detail);
      if (type === EventType.PRESS) {
        console.log('User pressed notification:', detail.notification);
      }
    });

    notifee.onForegroundEvent(({ type, detail }) => {
      console.log('Foreground event:', type, detail);
      if (type === EventType.PRESS) {
        console.log('User pressed notification:', detail.notification);
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
      console.error('Error displaying notification:', error);
    }
  }

  async sendTokenToServer(token: string) {
    console.log('TODO: Send FCM token to backend:', token);
  }

  onTokenRefresh(callback: (token: string) => void) {
    if (Platform.OS === 'web') return () => {};

    return messaging().onTokenRefresh((token) => {
      console.log('FCM Token refreshed:', token);
      callback(token);
    });
  }
}

export const notificationService = new NotificationService();
