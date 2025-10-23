import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGetChatsQuery } from '../../store/api/chatApi';
import { useTheme } from '../../theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Card, Avatar, Badge } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

interface ChatsScreenProps {
  navigation: any;
}

const ChatsScreen: React.FC<ChatsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetChatsQuery({ page: 1, limit: 20 });
  const chats = data?.data?.items || [];

  const getChatName = (item: any) => {
    if (item.type === 'direct') {
      return item.participants.find((p: any) => p.userId !== 'current')?.username || 'Chat';
    }
    return `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Chat`;
  };

  const getChatIcon = (type: string) => {
    switch (type) {
      case 'direct':
        return 'account';
      case 'match':
        return 'soccer';
      case 'team':
        return 'account-group';
      case 'tournament':
        return 'trophy';
      default:
        return 'message';
    }
  };

  const renderChatItem = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <Card
        onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
        style={{ marginBottom: theme.spacing.sm }}
        elevation="sm"
      >
        <View style={{ padding: theme.spacing.base }}>
          <View style={styles.chatRow}>
            <View style={{ position: 'relative' }}>
              <Avatar
                name={getChatName(item)}
                size="medium"
                variant="circular"
              />
              {item.type !== 'direct' && (
                <View
                  style={[
                    styles.chatTypeIcon,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Icon
                    name={getChatIcon(item.type)}
                    size={12}
                    color={theme.colors.onPrimary}
                  />
                </View>
              )}
            </View>

            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text
                  style={[
                    theme.typography.titleMedium,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                  numberOfLines={1}
                >
                  {getChatName(item)}
                </Text>
                {item.lastMessage && (
                  <Text
                    style={[
                      theme.typography.labelSmall,
                      { color: theme.colors.textSecondary, marginLeft: theme.spacing.sm },
                    ]}
                  >
                    {format(new Date(item.lastMessage.createdAt), 'HH:mm')}
                  </Text>
                )}
              </View>

              {item.lastMessage && (
                <View style={styles.lastMessageRow}>
                  <Text
                    style={[
                      theme.typography.bodySmall,
                      {
                        color: item.unreadCount > 0
                          ? theme.colors.text
                          : theme.colors.textSecondary,
                        fontWeight: item.unreadCount > 0 ? '600' : 'normal',
                        flex: 1,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.lastMessage.content}
                  </Text>
                  {item.unreadCount > 0 && (
                    <Badge
                      label={item.unreadCount.toString()}
                      variant="error"
                      size="small"
                      style={{ marginLeft: theme.spacing.sm }}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  if (isLoading && chats.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
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
          <View style={styles.emptyContainer}>
            <Icon
              name="message-outline"
              size={64}
              color={theme.colors.textTertiary}
              style={{ marginBottom: theme.spacing.base }}
            />
            <Text
              style={[
                theme.typography.titleMedium,
                { color: theme.colors.textSecondary, textAlign: 'center' },
              ]}
            >
              No chats yet
            </Text>
            <Text
              style={[
                theme.typography.bodySmall,
                {
                  color: theme.colors.textTertiary,
                  textAlign: 'center',
                  marginTop: theme.spacing.sm,
                },
              ]}
            >
              Start a conversation with your team
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTypeIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 400,
  },
});

export default ChatsScreen;
