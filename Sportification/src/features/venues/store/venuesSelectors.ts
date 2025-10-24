import { createSelector } from 'reselect';
import { RootState } from '@/store';
import { venuesAdapter } from './venuesSlice';

// Get the entity adapter selectors
const venuesAdapterSelectors = venuesAdapter.getSelectors<RootState>(
  (state) => state.venues
);

// Export entity adapter selectors
export const {
  selectAll: selectAllVenues,
  selectById: selectVenueById,
  selectIds: selectVenueIds,
  selectEntities: selectVenueEntities,
  selectTotal: selectTotalVenues,
} = venuesAdapterSelectors;

// Base selector
const selectVenuesState = (state: RootState) => state.venues;

// Loading and error selectors
export const selectVenuesLoading = createSelector(
  [selectVenuesState],
  (venues) => venues.loading
);

export const selectVenuesError = createSelector(
  [selectVenuesState],
  (venues) => venues.error
);

export const selectVenuesFilters = createSelector(
  [selectVenuesState],
  (venues) => venues.filters
);

// Filtered venues selectors
export const selectActiveVenues = createSelector(
  [selectAllVenues],
  (venues) => venues.filter((v) => v.status === 'active')
);

export const selectVerifiedVenues = createSelector(
  [selectAllVenues],
  (venues) => venues.filter((v) => v.isVerified)
);

export const selectVenuesBySport = createSelector(
  [selectAllVenues, (_state: RootState, sport: string) => sport],
  (venues, sport) => venues.filter((v) => v.sports.includes(sport))
);

export const selectVenuesByCity = createSelector(
  [selectAllVenues, (_state: RootState, city: string) => city],
  (venues, city) => venues.filter((v) => v.location.city.toLowerCase() === city.toLowerCase())
);

export const selectFilteredVenues = createSelector(
  [selectAllVenues, selectVenuesFilters],
  (venues, filters) => {
    let filtered = venues;

    if (filters.sport) {
      filtered = filtered.filter((v) => v.sports.includes(filters.sport!));
    }

    if (filters.city) {
      filtered = filtered.filter((v) => 
        v.location.city.toLowerCase() === filters.city!.toLowerCase()
      );
    }

    if (filters.status) {
      filtered = filtered.filter((v) => v.status === filters.status);
    }

    if (filters.isVerified !== null) {
      filtered = filtered.filter((v) => v.isVerified === filters.isVerified);
    }

    return filtered;
  }
);

// Derived selectors
export const selectVenuesStats = createSelector(
  [selectAllVenues],
  (venues) => ({
    total: venues.length,
    active: venues.filter((v) => v.status === 'active').length,
    verified: venues.filter((v) => v.isVerified).length,
    maintenance: venues.filter((v) => v.status === 'maintenance').length,
  })
);

export const selectTopRatedVenues = createSelector(
  [selectAllVenues],
  (venues) =>
    venues
      .filter((v) => v.ratings && v.ratings.average > 4)
      .slice(0, 10)
);

export const selectVenuesBySportCount = createSelector(
  [selectAllVenues],
  (venues) => {
    const sportCount: Record<string, number> = {};
    venues.forEach((venue) => {
      venue.sports.forEach((sport) => {
        sportCount[sport] = (sportCount[sport] || 0) + 1;
      });
    });
    return sportCount;
  }
);
