import { useCallback } from 'react';
import { useGetNotificationsQuery } from '../store/notificationApi';
import { notificationService } from '../services';

export function useNotificationsScreen(navigation: any) {
  const { data, isLoading, error, refetch } = useGetNotificationsQuery();
  const notifications = data?.data || [];

  const handleNotificationPress = useCallback(async (notificationId: string, notification: any) => {
    try {
      await notificationService.markAsRead(notificationId);
      await refetch();
      
      // Navigate based on notification type
      if (notification.type === 'match' && notification.matchId) {
        navigation.navigate('MatchDetail', { matchId: notification.matchId });
      } else if (notification.type === 'team' && notification.teamId) {
        navigation.navigate('TeamDetail', { teamId: notification.teamId });
      }
    } catch (err) {
      console.error('Failed to handle notification:', err);
    }
  }, [navigation, refetch]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      await refetch();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [refetch]);

  return {
    notifications,
    isLoading,
    error,
    onNotificationPress: handleNotificationPress,
    onMarkAllAsRead: handleMarkAllAsRead,
    onRefresh: refetch,
  };
}
