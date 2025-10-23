import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  useGetChatQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
} from '../../store/api/chatApi';
import { useAppSelector } from '../../store/hooks';
import { LoadingSpinner } from '@shared/components/atoms';
import { IconButton, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { socketService } from '@shared/services/socketService';
import { FadeIn } from 'react-native-reanimated';

interface ChatDetailScreenProps {
  navigation: any;
  route: any;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { chatId } = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { data: chatData } = useGetChatQuery(chatId);
  const { data: messagesData, isLoading, refetch } = useGetChatMessagesQuery({ chatId, page: 1, limit: 50 });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const styles = createStyles(theme);

  useEffect(() => {
    if (messagesData?.data?.items) {
      setMessages([...messagesData.data.items].reverse());
    }
  }, [messagesData]);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    };

    socketService.on('new-message', handleNewMessage);

    return () => {
      socketService.off('new-message', handleNewMessage);
    };
  }, [chatId]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const tempMessage = messageText;
    setMessageText('');

    try {
      await sendMessage({
        chatId,
        content: tempMessage,
      }).unwrap();

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      setMessageText(tempMessage);
      console.error('Failed to send message:', error);
    }
  };

  const renderMessage = ({ item }: any) => {
    const isMe = item.senderId === user?.id;
    const senderName = item.sender?.username || 'Unknown';

    return (
      <FadeIn duration={300}>
        <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
          {!isMe && (
            <Text style={[theme.typography.labelSmall, styles.senderName]}>
              {senderName}
            </Text>
          )}
          <Text
            style={[
              theme.typography.bodyMedium,
              isMe ? styles.myMessageText : styles.theirMessageText
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              theme.typography.labelSmall,
              isMe ? styles.myMessageTime : styles.theirMessageTime
            ]}
          >
            {format(new Date(item.createdAt), 'HH:mm')}
          </Text>
        </View>
      </FadeIn>
    );
  };

  if (isLoading && messages.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item.id || `msg-${index}`}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
        ListEmptyComponent={
          <EmptyState
            icon="message-text-outline"
            title="No messages yet"
            message="Start the conversation!"
          />
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={[theme.typography.bodyMedium, styles.input]}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          multiline
          maxLength={1000}
        />
        <IconButton
          icon="send"
          onPress={handleSend}
          disabled={!messageText.trim() || isSending}
          variant="filled"
          size="medium"
          color={messageText.trim() ? theme.colors.primary : theme.colors.surfaceVariant}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    messagesList: {
      padding: theme.spacing.base,
      flexGrow: 1,
    },
    messageContainer: {
      maxWidth: '75%',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primaryContainer,
      borderBottomRightRadius: theme.borderRadius.xs,
    },
    theirMessage: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.surfaceVariant,
      borderBottomLeftRadius: theme.borderRadius.xs,
    },
    senderName: {
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    myMessageText: {
      color: theme.colors.onPrimaryContainer,
      marginBottom: theme.spacing.xs,
    },
    theirMessageText: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.xs,
    },
    myMessageTime: {
      color: theme.colors.onPrimaryContainer,
      opacity: 0.7,
      alignSelf: 'flex-end',
    },
    theirMessageTime: {
      color: theme.colors.onSurfaceVariant,
      opacity: 0.7,
      alignSelf: 'flex-end',
    },
    inputContainer: {
      flexDirection: 'row',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      ...theme.elevation.level2,
      alignItems: 'flex-end',
      gap: theme.spacing.sm,
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.onSurface,
      maxHeight: 100,
    },
  });

export default ChatDetailScreen;
