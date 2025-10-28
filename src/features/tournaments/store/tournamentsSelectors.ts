import { createSelector } from 'reselect';
import { RootState } from '@/store';
import { tournamentsAdapter } from './tournamentsSlice';

// Get the entity adapter selectors
const tournamentsAdapterSelectors = tournamentsAdapter.getSelectors<RootState>(
  (state) => state.tournaments
);

// Export entity adapter selectors
export const {
  selectAll: selectAllTournaments,
  selectById: selectTournamentById,
  selectIds: selectTournamentIds,
  selectEntities: selectTournamentEntities,
  selectTotal: selectTotalTournaments,
} = tournamentsAdapterSelectors;

// Base selector
const selectTournamentsState = (state: RootState) => state.tournaments;

// Loading and error selectors
export const selectTournamentsLoading = createSelector(
  [selectTournamentsState],
  (tournaments) => tournaments.loading
);

export const selectTournamentsError = createSelector(
  [selectTournamentsState],
  (tournaments) => tournaments.error
);

export const selectTournamentsFilters = createSelector(
  [selectTournamentsState],
  (tournaments) => tournaments.filters
);

// Filtered tournaments selectors
export const selectOpenTournaments = createSelector(
  [selectAllTournaments],
  (tournaments) => tournaments.filter((t) => t.status === 'registration_open')
);

export const selectActiveTournaments = createSelector(
  [selectAllTournaments],
  (tournaments) => tournaments.filter((t) => t.status === 'in_progress')
);

export const selectCompletedTournaments = createSelector(
  [selectAllTournaments],
  (tournaments) => tournaments.filter((t) => t.status === 'completed')
);

export const selectTournamentsBySport = createSelector(
  [selectAllTournaments, (_state: RootState, sport: string) => sport],
  (tournaments, sport) => tournaments.filter((t) => t.sport === sport)
);

export const selectFilteredTournaments = createSelector(
  [selectAllTournaments, selectTournamentsFilters],
  (tournaments, filters) => {
    let filtered = tournaments;

    if (filters.sport) {
      filtered = filtered.filter((t) => t.sport === filters.sport);
    }

    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters.format) {
      filtered = filtered.filter((t) => t.format === filters.format);
    }

    return filtered;
  }
);

// Derived selectors
export const selectTournamentsStats = createSelector(
  [selectAllTournaments],
  (tournaments) => ({
    total: tournaments.length,
    open: tournaments.filter((t) => t.status === 'registration_open').length,
    active: tournaments.filter((t) => t.status === 'in_progress').length,
    completed: tournaments.filter((t) => t.status === 'completed').length,
    cancelled: tournaments.filter((t) => t.status === 'cancelled').length,
  })
);

export const selectTournamentsAvailableSpots = createSelector(
  [selectOpenTournaments],
  (tournaments) =>
    tournaments.reduce(
      (acc, t) => acc + (t.maxParticipants - t.currentParticipants),
      0
    )
);
