import { useCallback } from 'react';
import { useGetTournamentByIdQuery } from '../store/tournamentApi';
import { tournamentService } from '../services';

export function useTournamentDetailScreen(route: any, navigation: any) {
  const { tournamentId } = route.params;
  const { data, isLoading, error, refetch } = useGetTournamentByIdQuery(tournamentId);
  const tournament = data?.data;

  const handleJoinTournament = useCallback(async () => {
    try {
      await tournamentService.joinTournament(tournamentId);
      await refetch();
    } catch (err) {
      console.error('Failed to join tournament:', err);
    }
  }, [tournamentId, refetch]);

  const handleStartTournament = useCallback(async () => {
    try {
      await tournamentService.startTournament(tournamentId);
      await refetch();
    } catch (err) {
      console.error('Failed to start tournament:', err);
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
