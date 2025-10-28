import { useState, useCallback } from 'react';
import { useGetMessagesQuery } from '../store/chatApi';
import { chatService } from '../services';

export function useChatDetailScreen(route: any) {
  const { chatId } = route.params;
  const { data, isLoading, error, refetch } = useGetMessagesQuery(chatId);
  const messages = data?.data || [];
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) {
      return;
    }

    setSending(true);
    try {
      await chatService.sendMessage(chatId, message);
      setMessage('');
      await refetch();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  }, [chatId, message, refetch]);

  return {
    messages,
    isLoading,
    error,
    message,
    sending,
    onChangeMessage: setMessage,
    onSendMessage: handleSendMessage,
  };
}
