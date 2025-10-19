import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '../../store/api/notificationApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format } from 'date-fns';

interface NotificationsScreenProps {
  navigation: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetNotificationsQuery({ page: 1, limit: 50 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const notifications = data?.data?.items || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const handleNotificationPress = async (notification: any) => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id).unwrap();
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }

    switch (notification.type) {
      case 'match':
      case 'match_reminder':
      case 'match_started':
      case 'match_completed':
        if (notification.metadata?.matchId) {
          navigation.navigate('Matches', {
            screen: 'MatchDetail',
            params: { matchId: notification.metadata.matchId },
          });
        }
        break;
      case 'tournament':
      case 'tournament_started':
        if (notification.metadata?.tournamentId) {
          navigation.navigate('Tournaments', {
            screen: 'TournamentDetail',
            params: { tournamentId: notification.metadata.tournamentId },
          });
        }
        break;
      case 'booking':
      case 'booking_confirmed':
        if (notification.metadata?.venueId) {
          navigation.navigate('Venues', {
            screen: 'VenueDetail',
            params: { venueId: notification.metadata.venueId },
          });
        }
        break;
      case 'team':
        if (notification.metadata?.teamId) {
          navigation.navigate('Teams', {
            screen: 'TeamDetail',
            params: { teamId: notification.metadata.teamId },
          });
        }
        break;
      case 'message':
        if (notification.metadata?.chatId) {
          navigation.navigate('Chats', {
            screen: 'ChatDetail',
            params: { chatId: notification.metadata.chatId },
          });
        }
        break;
      default:
        break;
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      Alert.alert('Success', 'All notifications marked as read');
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to mark all as read');
    }
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationType}>{item.type.replace('_', ' ')}</Text>
        <Text style={styles.notificationTime}>
          {format(new Date(item.createdAt), 'MMM dd, HH:mm')}
        </Text>
      </View>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  if (isLoading && notifications.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerText}>{unreadCount} unread notifications</Text>
          <Button
            title="Mark All Read"
            onPress={handleMarkAllRead}
            loading={isMarkingAll}
            variant="outline"
            style={styles.markAllButton}
            textStyle={styles.markAllButtonText}
          />
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  markAllButtonText: {
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationsScreen;
