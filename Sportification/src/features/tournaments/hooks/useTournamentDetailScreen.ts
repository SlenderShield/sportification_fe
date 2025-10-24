import { logger } from '@core';
import { useCallback } from 'react';
import { useGetTournamentByIdQuery } from '../store/tournamentApi';
import { tournamentService } from '../services';

export function useTournamentDetailScreen(route: any, _navigation: any) {
  const { tournamentId } = route.params;
  const { data, isLoading, error, refetch } = useGetTournamentByIdQuery(tournamentId);
  const tournament = data?.data;

  const handleJoinTournament = useCallback(async () => {
    try {
      await tournamentService.joinTournament(tournamentId);
      await refetch();
    } catch (err) {
      logger.error('Failed to join tournament:', err instanceof Error ? err : undefined);
    }
  }, [tournamentId, refetch]);

  const handleStartTournament = useCallback(async () => {
    try {
      await tournamentService.startTournament(tournamentId);
      await refetch();
    } catch (err) {
      logger.error('Failed to start tournament:', err instanceof Error ? err : undefined);
    }
  }, [tournamentId, refetch]);

  return {
    tournament,
    isLoading,
    error,
    onJoinTournament: handleJoinTournament,
    onStartTournament: handleStartTournament,
  };
}
