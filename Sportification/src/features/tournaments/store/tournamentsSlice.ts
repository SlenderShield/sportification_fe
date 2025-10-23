import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { Tournament } from '../types';

// Entity adapter for normalized state
export const tournamentsAdapter = createEntityAdapter<Tournament>({
  selectId: (tournament) => tournament._id,
  sortComparer: (a, b) => {
    // Sort by start date, upcoming first
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateA - dateB;
  },
});

// Initial state
const initialState = tournamentsAdapter.getInitialState({
  loading: false,
  error: null as string | null,
  filters: {
    sport: null as string | null,
    status: null as string | null,
    format: null as string | null,
  },
});

export type TournamentsState = typeof initialState;

// Slice
const tournamentsSlice = createSlice({
  name: 'tournaments',
  initialState,
  reducers: {
    // Entity adapter reducers
    tournamentAdded: tournamentsAdapter.addOne,
    tournamentsAdded: tournamentsAdapter.addMany,
    tournamentUpdated: tournamentsAdapter.updateOne,
    tournamentRemoved: tournamentsAdapter.removeOne,
    tournamentsCleared: tournamentsAdapter.removeAll,
    
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
        format: null,
      };
    },
  },
});

export const {
  tournamentAdded,
  tournamentsAdded,
  tournamentUpdated,
  tournamentRemoved,
  tournamentsCleared,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = tournamentsSlice.actions;

export default tournamentsSlice.reducer;
