import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { Match } from '../types';

// Entity adapter for normalized state
export const matchesAdapter = createEntityAdapter<Match>({
  selectId: (match) => match._id,
  sortComparer: (a, b) => {
    // Sort by date, most recent first
    const dateA = new Date(a.schedule.date).getTime();
    const dateB = new Date(b.schedule.date).getTime();
    return dateB - dateA;
  },
});

// Initial state
const initialState = matchesAdapter.getInitialState({
  loading: false,
  error: null as string | null,
  filters: {
    sport: null as string | null,
    status: null as string | null,
    location: null as string | null,
  },
});

export type MatchesState = typeof initialState;

// Slice
const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    // Entity adapter reducers
    matchAdded: matchesAdapter.addOne,
    matchesAdded: matchesAdapter.addMany,
    matchUpdated: matchesAdapter.updateOne,
    matchRemoved: matchesAdapter.removeOne,
    matchesCleared: matchesAdapter.removeAll,
    
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
        status: null,
        location: null,
      };
    },
  },
});

export const {
  matchAdded,
  matchesAdded,
  matchUpdated,
  matchRemoved,
  matchesCleared,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = matchesSlice.actions;

export default matchesSlice.reducer;
