import { logger } from '@core';
import { useCallback } from 'react';
import { useGetMatchByIdQuery } from '../store/matchApi';
import { matchService } from '../services';

export function useMatchDetailScreen(route: any, _navigation: any) {
  const { matchId } = route.params;
  const { data, isLoading, error, refetch } = useGetMatchByIdQuery(matchId);
  const match = data?.data;

  const handleJoinMatch = useCallback(async () => {
    try {
      await matchService.joinMatch(matchId);
      await refetch();
    } catch (err) {
      logger.error('Failed to join match:', err instanceof Error ? err : undefined);
    }
  }, [matchId, refetch]);

  const handleLeaveMatch = useCallback(async () => {
    try {
      await matchService.leaveMatch(matchId);
      await refetch();
    } catch (err) {
      logger.error('Failed to leave match:', err instanceof Error ? err : undefined);
    }
  }, [matchId, refetch]);

  const getStatusVariant = useCallback((status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  }, []);

  return {
    match,
    isLoading,
    error,
    getStatusVariant,
    onJoinMatch: handleJoinMatch,
    onLeaveMatch: handleLeaveMatch,
  };
}
