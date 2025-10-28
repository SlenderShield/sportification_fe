import { useCallback } from 'react';

export function useFriendsScreen(navigation: any) {
  const friends = []; // TODO: Fetch from API
  const isLoading = false;

  const handleFriendPress = useCallback((userId: string) => {
    navigation.navigate('Profile', { userId });
  }, [navigation]);

  const handleAddFriend = useCallback(() => {
    // Show add friend modal
    console.log('Add friend');
  }, []);

  return {
    friends,
    isLoading,
    onFriendPress: handleFriendPress,
    onAddFriend: handleAddFriend,
  };
}
