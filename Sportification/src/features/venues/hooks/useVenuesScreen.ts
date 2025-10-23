import { useCallback } from 'react';
import { useGetVenuesQuery } from '../store/venueApi';

export function useVenuesScreen(navigation: any) {
  const { data, isLoading, error, refetch } = useGetVenuesQuery({ page: 1, limit: 10 });
  const venues = data?.data?.items || [];

  const handleVenuePress = useCallback((venueId: string) => {
    navigation.navigate('VenueDetail', { venueId });
  }, [navigation]);

  const handleCreateBooking = useCallback((venueId: string) => {
    navigation.navigate('CreateBooking', { venueId });
  }, [navigation]);

  return {
    venues,
    isLoading,
    error,
    onVenuePress: handleVenuePress,
    onCreateBooking: handleCreateBooking,
    onRefresh: refetch,
  };
}
