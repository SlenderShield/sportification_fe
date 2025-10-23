import React from 'react';
import { useChatsScreen } from '../hooks';
import { ListScreenTemplate } from '@shared/components/templates';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme';
import { Card, Avatar, Badge } from '@shared/components/organisms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

interface ChatsScreenProps {
  navigation: any;
}

const ChatsScreen: React.FC<ChatsScreenProps> = ({ navigation }) => {
  const props = useChatsScreen(navigation);
  const { theme } = useTheme();

  const renderChatItem = (item: any) => (
    <Card
      onPress={() => props.onChatPress(item.id)}
      style={{ marginBottom: theme.spacing.sm }}
      elevation="sm"
    >
      <View style={{ padding: theme.spacing.base }}>
        <View style={styles.chatRow}>
          <View style={{ position: 'relative' }}>
            <Avatar
              name={props.getChatName(item)}
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
                  name={props.getChatIcon(item.type)}
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
                {props.getChatName(item)}
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
  );

  return (
    <ListScreenTemplate
      title="Chats"
      items={props.chats}
      renderItem={renderChatItem}
      isLoading={props.isLoading}
      onRefresh={props.onRefresh}
      emptyMessage="No chats yet. Start a conversation with your team"
      emptyIcon="message-outline"
    />
  );
};

const styles = StyleSheet.create({
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
});

export default ChatsScreen;
