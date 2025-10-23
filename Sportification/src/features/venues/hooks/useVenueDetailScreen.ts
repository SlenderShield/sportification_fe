import { useCallback } from 'react';
import { useGetVenueByIdQuery } from '../store/venueApi';

export function useVenueDetailScreen(route: any, navigation: any) {
  const { venueId } = route.params;
  const { data, isLoading, error, refetch } = useGetVenueByIdQuery(venueId);
  const venue = data?.data;

  const handleBookVenue = useCallback(() => {
    navigation.navigate('CreateBooking', { venueId });
  }, [venueId, navigation]);

  const handleViewOnMap = useCallback(() => {
    // Open map with venue location
    console.log('View on map:', venue?.location);
  }, [venue]);

  return {
    venue,
    isLoading,
    error,
    onBookVenue: handleBookVenue,
    onViewOnMap: handleViewOnMap,
  };
}
