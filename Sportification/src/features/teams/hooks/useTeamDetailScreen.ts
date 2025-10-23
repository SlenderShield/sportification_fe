import { useCallback } from 'react';
import { useGetTeamByIdQuery } from '../store/teamApi';
import { teamService } from '../services';

export function useTeamDetailScreen(route: any, navigation: any) {
  const { teamId } = route.params;
  const { data, isLoading, error, refetch } = useGetTeamByIdQuery(teamId);
  const team = data?.data;

  const handleJoinTeam = useCallback(async () => {
    try {
      await teamService.joinTeam(teamId);
      await refetch();
    } catch (err) {
      console.error('Failed to join team:', err);
    }
  }, [teamId, refetch]);

  const handleLeaveTeam = useCallback(async () => {
    try {
      await teamService.leaveTeam(teamId);
      await refetch();
    } catch (err) {
      console.error('Failed to leave team:', err);
    }
  }, [teamId, refetch]);

  const handleEditTeam = useCallback(() => {
    navigation.navigate('EditTeam', { teamId });
  }, [teamId, navigation]);

  return {
    team,
    isLoading,
    error,
    onJoinTeam: handleJoinTeam,
    onLeaveTeam: handleLeaveTeam,
    onEditTeam: handleEditTeam,
  };
}
