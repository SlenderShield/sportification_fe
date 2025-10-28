import { useCallback } from 'react';
import { useGetTournamentsQuery } from '../store/tournamentApi';

export function useTournamentsScreen(navigation: any) {
  const { data, isLoading, error, refetch } = useGetTournamentsQuery({ page: 1, limit: 10 });
  const tournaments = data?.data?.items || [];

  const getStatusVariant = useCallback((status: string) => {
    switch (status) {
      case 'upcoming': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  }, []);

  const handleTournamentPress = useCallback((tournamentId: string) => {
    navigation.navigate('TournamentDetail', { tournamentId });
  }, [navigation]);

  const handleCreateTournament = useCallback(() => {
    navigation.navigate('CreateTournament');
  }, [navigation]);

  return {
    tournaments,
    isLoading,
    error,
    getStatusVariant,
    onTournamentPress: handleTournamentPress,
    onCreateTournament: handleCreateTournament,
    onRefresh: refetch,
  };
}
