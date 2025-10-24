import React from 'react';
import { useChatDetailScreen } from '../hooks';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LoadingSpinner } from '@shared/components/atoms';
import { IconButton, EmptyState } from '@shared/components/molecules';
import { useTheme } from '../../../theme';
import { format } from 'date-fns';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ChatDetailScreenProps {
  navigation: any;
  route: any;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ route }) => {
  const { theme } = useTheme();
  const { chatId } = route.params;
  const props = useChatDetailScreen(chatId);
  const styles = createStyles(theme);

  const renderMessage = ({ item }: any) => {
    const isMe = props.isMyMessage(item);
    const senderName = item.sender?.username || 'Unknown';

    return (
      <Animated.View entering={FadeIn.duration(300)}>
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
      </Animated.View>
    );
  };

  if (props.isLoading && props.messages.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={props.flatListRef}
        data={props.messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item.id || `msg-${index}`}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => {
          if (props.messages.length > 0) {
            props.flatListRef.current?.scrollToEnd({ animated: false });
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
          value={props.messageText}
          onChangeText={props.setMessageText}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          multiline
          maxLength={1000}
        />
        <IconButton
          icon="send"
          onPress={props.handleSend}
          disabled={!props.messageText.trim() || props.isSending}
          variant="filled"
          size="medium"
          color={props.messageText.trim() ? theme.colors.primary : theme.colors.surfaceVariant}
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
