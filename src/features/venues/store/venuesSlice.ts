import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { Venue } from '../types';

// Entity adapter for normalized state
export const venuesAdapter = createEntityAdapter<Venue>({
  selectId: (venue) => venue._id,
  sortComparer: (a, b) => {
    // Sort by rating, highest first
    const ratingA = a.ratings?.average || 0;
    const ratingB = b.ratings?.average || 0;
    return ratingB - ratingA;
  },
});

// Initial state
const initialState = venuesAdapter.getInitialState({
  loading: false,
  error: null as string | null,
  filters: {
    sport: null as string | null,
    city: null as string | null,
    status: null as string | null,
    isVerified: null as boolean | null,
  },
});

export type VenuesState = typeof initialState;

// Slice
const venuesSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    // Entity adapter reducers
    venueAdded: venuesAdapter.addOne,
    venuesAdded: venuesAdapter.addMany,
    venueUpdated: venuesAdapter.updateOne,
    venueRemoved: venuesAdapter.removeOne,
    venuesCleared: venuesAdapter.removeAll,
    
    // Custom reducers
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        sport: null,
        city: null,
        status: null,
        isVerified: null,
      };
    },
  },
});

export const {
  venueAdded,
  venuesAdded,
  venueUpdated,
  venueRemoved,
  venuesCleared,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = venuesSlice.actions;

export default venuesSlice.reducer;
