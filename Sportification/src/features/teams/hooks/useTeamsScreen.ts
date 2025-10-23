import { useCallback } from 'react';
import { useGetTeamsQuery } from '../store/teamApi';

export function useTeamsScreen(navigation: any) {
  const { data, isLoading, error, refetch } = useGetTeamsQuery({ page: 1, limit: 10 });
  const teams = data?.data?.items || [];

  const handleTeamPress = useCallback((teamId: string) => {
    navigation.navigate('TeamDetail', { teamId });
  }, [navigation]);

  const handleCreateTeam = useCallback(() => {
    navigation.navigate('CreateTeam');
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    teams,
    isLoading,
    error,
    onTeamPress: handleTeamPress,
    onCreateTeam: handleCreateTeam,
    onRefresh: handleRefresh,
  };
}
