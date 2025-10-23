import { useCallback } from 'react';
import { useGetCurrentUserQuery } from '../store/paymentApi';

export function useProfileScreen(navigation: any) {
  const { data, isLoading, error, refetch } = useGetCurrentUserQuery();
  const user = data?.data;

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const handleSettings = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const handleFriends = useCallback(() => {
    navigation.navigate('Friends');
  }, [navigation]);

  return {
    user,
    isLoading,
    error,
    onEditProfile: handleEditProfile,
    onSettings: handleSettings,
    onFriends: handleFriends,
    onRefresh: refetch,
  };
}
