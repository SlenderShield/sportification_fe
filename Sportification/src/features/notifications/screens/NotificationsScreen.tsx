import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '../../store/api/notificationApi';
import { useTheme } from '../../theme';
import { LoadingSpinner } from '@shared/components/atoms';
import { Button } from '@shared/components/atoms';
import { Card, Badge, EmptyState } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

interface NotificationsScreenProps {
  navigation: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetNotificationsQuery({ page: 1, limit: 50 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const notifications = data?.data?.items || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
      case 'match_reminder':
      case 'match_started':
      case 'match_completed':
        return 'soccer';
      case 'tournament':
      case 'tournament_started':
        return 'trophy';
      case 'booking':
      case 'booking_confirmed':
        return 'calendar-check';
      case 'team':
        return 'account-group';
      case 'message':
        return 'message';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'match_started':
      case 'tournament_started':
        return theme.colors.warning;
      case 'match_completed':
      case 'booking_confirmed':
        return theme.colors.success;
      case 'message':
        return theme.colors.info;
      default:
        return theme.colors.primary;
    }
  };

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

  const renderNotification = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <Card
        onPress={() => handleNotificationPress(item)}
        style={{
          marginBottom: theme.spacing.sm,
          opacity: item.read ? 0.7 : 1,
        }}
        elevation="sm"
      >
        <View style={{ padding: theme.spacing.base }}>
          <View style={styles.notificationRow}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: item.read
                    ? theme.colors.surfaceVariant
                    : `${getNotificationColor(item.type)}20`,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <Icon
                name={getNotificationIcon(item.type)}
                size={24}
                color={item.read ? theme.colors.textSecondary : getNotificationColor(item.type)}
              />
            </View>

            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Badge
                  label={item.type.replace('_', ' ')}
                  variant={item.read ? 'default' : 'info'}
                  size="small"
                />
                <Text
                  style={[
                    theme.typography.labelSmall,
                    { color: theme.colors.textSecondary, marginLeft: theme.spacing.sm },
                  ]}
                >
                  {format(new Date(item.createdAt), 'MMM dd, HH:mm')}
                </Text>
              </View>

              <Text
                style={[
                  theme.typography.titleMedium,
                  {
                    color: theme.colors.text,
                    marginTop: theme.spacing.xs,
                    marginBottom: theme.spacing.xs,
                  },
                ]}
                numberOfLines={2}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  theme.typography.bodySmall,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={2}
              >
                {item.message}
              </Text>
            </View>

            {!item.read && (
              <View
                style={[
                  styles.unreadDot,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            )}
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  if (isLoading && notifications.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {unreadCount > 0 && (
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.surface,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.divider,
              padding: theme.spacing.base,
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Icon
              name="bell-badge"
              size={20}
              color={theme.colors.primary}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text
              style={[
                theme.typography.titleMedium,
                { color: theme.colors.text, flex: 1 },
              ]}
            >
              {unreadCount} unread
            </Text>
          </View>
          <Button
            title="Mark All Read"
            onPress={handleMarkAllRead}
            loading={isMarkingAll}
            variant="text"
            size="small"
            icon="check-all"
          />
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { padding: theme.spacing.base },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="bell-check"
            title="All Caught Up!"
            message="You have no notifications"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  list: {
    flexGrow: 1,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});

export default NotificationsScreen;
