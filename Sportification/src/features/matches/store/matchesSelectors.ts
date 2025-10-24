import { createSelector } from 'reselect';
import { RootState } from '@/store';
import { matchesAdapter } from './matchesSlice';

// Get the entity adapter selectors
const matchesAdapterSelectors = matchesAdapter.getSelectors<RootState>(
  (state) => state.matches
);

// Export entity adapter selectors
export const {
  selectAll: selectAllMatches,
  selectById: selectMatchById,
  selectIds: selectMatchIds,
  selectEntities: selectMatchEntities,
  selectTotal: selectTotalMatches,
} = matchesAdapterSelectors;

// Base selector
const selectMatchesState = (state: RootState) => state.matches;

// Loading and error selectors
export const selectMatchesLoading = createSelector(
  [selectMatchesState],
  (matches) => matches.loading
);

export const selectMatchesError = createSelector(
  [selectMatchesState],
  (matches) => matches.error
);

export const selectMatchesFilters = createSelector(
  [selectMatchesState],
  (matches) => matches.filters
);

// Filtered matches selectors
export const selectUpcomingMatches = createSelector(
  [selectAllMatches],
  (matches) => matches.filter((match) => match.status === 'upcoming')
);

export const selectActiveMatches = createSelector(
  [selectAllMatches],
  (matches) => matches.filter((match) => match.status === 'in-progress')
);

export const selectCompletedMatches = createSelector(
  [selectAllMatches],
  (matches) => matches.filter((match) => match.status === 'completed')
);

export const selectMatchesBySport = createSelector(
  [selectAllMatches, (_state: RootState, sport: string) => sport],
  (matches, sport) => matches.filter((match) => match.sport === sport)
);

export const selectFilteredMatches = createSelector(
  [selectAllMatches, selectMatchesFilters],
  (matches, filters) => {
    let filtered = matches;

    if (filters.sport) {
      filtered = filtered.filter((match) => match.sport === filters.sport);
    }

    if (filters.status) {
      filtered = filtered.filter((match) => match.status === filters.status);
    }

    if (filters.location) {
      filtered = filtered.filter((match) => 
        match.venue?.address?.city?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    return filtered;
  }
);

// Derived selectors
export const selectMatchesStats = createSelector(
  [selectAllMatches],
  (matches) => ({
    total: matches.length,
    upcoming: matches.filter((m) => m.status === 'upcoming').length,
    active: matches.filter((m) => m.status === 'in-progress').length,
    completed: matches.filter((m) => m.status === 'completed').length,
    cancelled: matches.filter((m) => m.status === 'cancelled').length,
  })
);

export const selectMatchesAvailableSpots = createSelector(
  [selectUpcomingMatches],
  (matches) =>
    matches.reduce(
      (acc, match) => acc + (match.maxParticipants - match.currentParticipants),
      0
    )
);
