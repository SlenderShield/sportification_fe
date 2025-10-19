import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  useGetChatQuery,
  useGetChatMessagesQuery,
  useSendMessageMutation,
} from '../../store/api/chatApi';
import { useAppSelector } from '../../store/hooks';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { format } from 'date-fns';
import { socketService } from '../../services/socketService';

interface ChatDetailScreenProps {
  navigation: any;
  route: any;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ navigation, route }) => {
  const { chatId } = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { data: chatData } = useGetChatQuery(chatId);
  const { data: messagesData, isLoading, refetch } = useGetChatMessagesQuery({ chatId, page: 1, limit: 50 });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);

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
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        {!isMe && <Text style={styles.senderName}>{senderName}</Text>}
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.messageTime}>
          {format(new Date(item.createdAt), 'HH:mm')}
        </Text>
      </View>
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
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!messageText.trim() || isSending}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default ChatDetailScreen;
