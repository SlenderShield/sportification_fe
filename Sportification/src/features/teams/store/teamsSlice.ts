import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { Team } from '../types';

// Entity adapter for normalized state
export const teamsAdapter = createEntityAdapter<Team>({
  selectId: (team) => team._id,
  sortComparer: (a, b) => {
    // Sort by creation date, most recent first
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  },
});

// Initial state
const initialState = teamsAdapter.getInitialState({
  loading: false,
  error: null as string | null,
  filters: {
    sport: null as string | null,
    isActive: null as boolean | null,
    hasOpenings: null as boolean | null,
  },
});

export type TeamsState = typeof initialState;

// Slice
const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // Entity adapter reducers
    teamAdded: teamsAdapter.addOne,
    teamsAdded: teamsAdapter.addMany,
    teamUpdated: teamsAdapter.updateOne,
    teamRemoved: teamsAdapter.removeOne,
    teamsCleared: teamsAdapter.removeAll,
    
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
        isActive: null,
        hasOpenings: null,
      };
    },
  },
});

export const {
  teamAdded,
  teamsAdded,
  teamUpdated,
  teamRemoved,
  teamsCleared,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = teamsSlice.actions;

export default teamsSlice.reducer;
