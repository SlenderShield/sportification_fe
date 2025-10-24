import { useState, useCallback } from 'react';
import { useGetMatchesQuery } from '../store/matchApi';

/**
 * Hook for managing MatchesScreen logic
 * Separates business logic from presentation
 * 
 * @example
 * ```typescript
 * const MyScreen = () => {
 *   const props = useMatchesScreen(navigation);
 *   return <MatchesView {...props} />;
 * };
 * ```
 */
export function useMatchesScreen(navigation: any) {
  const [page] = useState(1);
  const { data, isLoading, refetch } = useGetMatchesQuery({ page, limit: 10 });

  const matches = data?.data?.items || [];

  const handleMatchPress = useCallback(
    (matchId: string) => {
      navigation.navigate('MatchDetail', { matchId });
    },
    [navigation]
  );

  const handleCreateMatch = useCallback(() => {
    navigation.navigate('CreateMatch');
  }, [navigation]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const getStatusVariant = useCallback((status: string) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  }, []);

  return {
    matches,
    isLoading,
    onMatchPress: handleMatchPress,
    onCreateMatch: handleCreateMatch,
    onRefresh: handleRefresh,
    getStatusVariant,
  };
}
