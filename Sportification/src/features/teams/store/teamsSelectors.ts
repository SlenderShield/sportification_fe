import { createSelector } from 'reselect';
import { RootState } from '@/store';
import { teamsAdapter } from './teamsSlice';

// Get the entity adapter selectors
const teamsAdapterSelectors = teamsAdapter.getSelectors<RootState>(
  (state) => state.teams
);

// Export entity adapter selectors
export const {
  selectAll: selectAllTeams,
  selectById: selectTeamById,
  selectIds: selectTeamIds,
  selectEntities: selectTeamEntities,
  selectTotal: selectTotalTeams,
} = teamsAdapterSelectors;

// Base selector
const selectTeamsState = (state: RootState) => state.teams;

// Loading and error selectors
export const selectTeamsLoading = createSelector(
  [selectTeamsState],
  (teams) => teams.loading
);

export const selectTeamsError = createSelector(
  [selectTeamsState],
  (teams) => teams.error
);

export const selectTeamsFilters = createSelector(
  [selectTeamsState],
  (teams) => teams.filters
);

// Filtered teams selectors
export const selectActiveTeams = createSelector(
  [selectAllTeams],
  (teams) => teams.filter((team) => team.isActive)
);

export const selectTeamsWithOpenings = createSelector(
  [selectAllTeams],
  (teams) => teams.filter((team) => !team.isFull)
);

export const selectTeamsBySport = createSelector(
  [selectAllTeams, (_state: RootState, sport: string) => sport],
  (teams, sport) => teams.filter((team) => team.sport === sport)
);

export const selectFilteredTeams = createSelector(
  [selectAllTeams, selectTeamsFilters],
  (teams, filters) => {
    let filtered = teams;

    if (filters.sport) {
      filtered = filtered.filter((team) => team.sport === filters.sport);
    }

    if (filters.isActive !== null) {
      filtered = filtered.filter((team) => team.isActive === filters.isActive);
    }

    if (filters.hasOpenings !== null) {
      filtered = filtered.filter((team) => !team.isFull === filters.hasOpenings);
    }

    return filtered;
  }
);

// Derived selectors
export const selectTeamsStats = createSelector(
  [selectAllTeams],
  (teams) => ({
    total: teams.length,
    active: teams.filter((t) => t.isActive).length,
    withOpenings: teams.filter((t) => !t.isFull).length,
    full: teams.filter((t) => t.isFull).length,
  })
);

export const selectTotalTeamMembers = createSelector(
  [selectAllTeams],
  (teams) => teams.reduce((acc, team) => acc + team.memberCount, 0)
);
