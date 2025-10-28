import { useCallback } from 'react';
import { useGetChatsQuery } from '../store/chatApi';

export function useChatsScreen(navigation: any) {
  const { data, isLoading, error, refetch } = useGetChatsQuery();
  const chats = data?.data || [];

  const handleChatPress = useCallback((chatId: string) => {
    navigation.navigate('ChatDetail', { chatId });
  }, [navigation]);

  return {
    chats,
    isLoading,
    error,
    onChatPress: handleChatPress,
    onRefresh: refetch,
  };
}
