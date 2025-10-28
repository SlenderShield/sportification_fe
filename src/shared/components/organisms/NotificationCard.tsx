/**
 * Notification Card Component
 * Enhanced notification display with action buttons and grouping support
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { Card } from '../ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerLightImpact } from '@shared/utils/hapticFeedback';
import { formatDistanceToNow } from 'date-fns';

export type NotificationType = 'match' | 'team' | 'tournament' | 'message' | 'friend' | 'system';

export interface NotificationAction {
  label: string;
  icon?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  imageUrl?: string;
  actions?: NotificationAction[];
  grouped?: boolean;
  groupCount?: number;
}

interface NotificationCardProps {
  notification: NotificationItem;
  onPress?: () => void;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onMarkAsRead,
  onDelete,
}) => {
  const { theme } = useTheme();

  const getTypeIcon = (): string => {
    switch (notification.type) {
      case 'match':
        return 'soccer';
      case 'team':
        return 'account-group';
      case 'tournament':
        return 'trophy';
      case 'message':
        return 'message-text';
      case 'friend':
        return 'account-plus';
      case 'system':
        return 'bell';
      default:
        return 'bell';
    }
  };

  const getTypeColor = (): string => {
    switch (notification.type) {
      case 'match':
        return theme.colors.primary;
      case 'team':
        return theme.colors.secondary;
      case 'tournament':
        return theme.colors.tertiary;
      case 'message':
        return theme.colors.info;
      case 'friend':
        return theme.colors.success;
      case 'system':
        return theme.colors.textSecondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const handlePress = () => {
    triggerLightImpact();
    if (onPress) {
      onPress();
    }
  };

  const handleAction = (action: NotificationAction) => {
    triggerLightImpact();
    action.onPress();
  };

  const getActionButtonStyle = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.onPrimary,
        };
      case 'destructive':
        return {
          backgroundColor: theme.colors.error,
          color: theme.colors.onError,
        };
      default:
        return {
          backgroundColor: theme.colors.surfaceVariant,
          color: theme.colors.onSurfaceVariant,
        };
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.message}`}
      accessibilityHint={notification.read ? 'Read notification' : 'Unread notification. Tap to open'}
    >
      <Card
        variant="elevated"
        style={[
          styles.card,
          !notification.read && {
            borderLeftWidth: 4,
            borderLeftColor: getTypeColor(),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${getTypeColor()}20` },
            ]}
          >
            <Icon name={getTypeIcon()} size={20} color={getTypeColor()} />
          </View>
          
          <View style={styles.headerContent}>
            <Text
              style={[
                theme.typography.titleSmall,
                { color: theme.colors.text },
                !notification.read && { fontWeight: '700' },
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            <Text
              style={[
                theme.typography.labelSmall,
                { color: theme.colors.textSecondary },
              ]}
            >
              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              {notification.grouped && notification.groupCount && ` • ${notification.groupCount} notifications`}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {!notification.read && onMarkAsRead && (
              <Pressable
                onPress={() => {
                  triggerLightImpact();
                  onMarkAsRead();
                }}
                style={styles.iconButton}
                accessibilityLabel="Mark as read"
                accessibilityRole="button"
              >
                <Icon name="check" size={20} color={theme.colors.textSecondary} />
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                onPress={() => {
                  triggerLightImpact();
                  onDelete();
                }}
                style={styles.iconButton}
                accessibilityLabel="Delete notification"
                accessibilityRole="button"
              >
                <Icon name="close" size={20} color={theme.colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Message */}
        <Text
          style={[
            theme.typography.bodyMedium,
            { color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
          ]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>

        {/* Actions */}
        {notification.actions && notification.actions.length > 0 && (
          <View style={[styles.actions, { marginTop: theme.spacing.md }]}>
            {notification.actions.map((action, index) => {
              const buttonStyle = getActionButtonStyle(action.variant);
              return (
                <Pressable
                  key={index}
                  onPress={() => handleAction(action)}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: buttonStyle.backgroundColor,
                      borderRadius: theme.borderRadius.sm,
                    },
                  ]}
                  accessibilityLabel={action.label}
                  accessibilityRole="button"
                >
                  {action.icon && (
                    <Icon
                      name={action.icon}
                      size={16}
                      color={buttonStyle.color}
                      style={{ marginRight: theme.spacing.xs }}
                    />
                  )}
                  <Text
                    style={[
                      theme.typography.labelMedium,
                      { color: buttonStyle.color, fontWeight: '600' },
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default NotificationCard;
