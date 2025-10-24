# State Management Guide

## Overview

This guide explains the state management architecture in the Sportification app, built using Redux Toolkit (RTK), RTK Query, Entity Adapters, and Reselect.

## Architecture

### Three-Layer State System

```
1. Server State (RTK Query)
   ↓
2. Client State (Redux Slices with Entity Adapters)
   ↓
3. Derived State (Reselect Selectors)
```

### When to Use Each Layer

**RTK Query (Server State)**
- Fetching data from API
- Caching server responses
- Automatic refetching
- Optimistic updates
- **Use for**: API calls, server-synced data

**Redux Slices (Client State)**
- App-specific state
- Normalized data storage
- Filter/sort state
- UI state
- **Use for**: Local app state, filters, normalized entities

**Reselect (Derived State)**
- Computing derived values
- Filtering/sorting data
- Aggregating statistics
- Combining multiple state slices
- **Use for**: Computed values, filtered views, stats

---

## Using Entity Adapters

### What is an Entity Adapter?

Entity Adapters normalize your data, storing it as:
```typescript
{
  ids: ['1', '2', '3'],           // Array of IDs
  entities: {                      // Lookup table
    '1': { _id: '1', name: '...' },
    '2': { _id: '2', name: '...' },
    '3': { _id: '3', name: '...' },
  }
}
```

**Benefits:**
- O(1) lookup by ID
- No data duplication
- Efficient updates
- Built-in CRUD operations

### Creating an Entity Adapter

```typescript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Team } from '../types';

// 1. Create the adapter
export const teamsAdapter = createEntityAdapter<Team>({
  selectId: (team) => team._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// 2. Create initial state
const initialState = teamsAdapter.getInitialState({
  loading: false,
  error: null,
  filters: {},
});

// 3. Create the slice
const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    // Entity adapter CRUD operations
    teamAdded: teamsAdapter.addOne,
    teamsAdded: teamsAdapter.addMany,
    teamUpdated: teamsAdapter.updateOne,
    teamRemoved: teamsAdapter.removeOne,
    
    // Custom reducers
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
```

### Using Entity Actions

```typescript
import { useAppDispatch } from '@store/hooks';
import { teamsAdded, teamUpdated } from '@features/teams/store';

const Component = () => {
  const dispatch = useAppDispatch();
  
  // Add multiple teams
  dispatch(teamsAdded([team1, team2, team3]));
  
  // Update a team
  dispatch(teamUpdated({
    id: 'team-123',
    changes: { name: 'New Name' }
  }));
};
```

---

## Using Selectors

### Basic Selector Usage

```typescript
import { useAppSelector } from '@store/hooks';
import { selectAllMatches, selectMatchesLoading } from '@store/selectors';

const MatchesScreen = () => {
  // Select data from store
  const matches = useAppSelector(selectAllMatches);
  const loading = useAppSelector(selectMatchesLoading);
  
  if (loading) return <LoadingSpinner />;
  return <MatchList matches={matches} />;
};
```

### Entity Adapter Selectors

Every entity adapter automatically provides:

```typescript
// Provided by entity adapter
selectAll        // Get all entities as array
selectById       // Get single entity by ID
selectIds        // Get array of IDs
selectEntities   // Get entities lookup object
selectTotal      // Get total count
```

**Usage:**
```typescript
import { selectAllTeams, selectTeamById } from '@store/selectors';

// Get all teams
const teams = useAppSelector(selectAllTeams);

// Get specific team
const team = useAppSelector((state) => selectTeamById(state, 'team-123'));
```

### Creating Custom Selectors

```typescript
import { createSelector } from 'reselect';
import { RootState } from '@/store';

// Input selector
const selectAllMatches = (state: RootState) => state.matches.entities;

// Memoized selector
export const selectUpcomingMatches = createSelector(
  [selectAllMatches],
  (matches) => matches.filter((m) => m.status === 'upcoming')
);
```

### Parameterized Selectors

```typescript
// Define selector factory
export const selectMatchesBySport = createSelector(
  [
    selectAllMatches,
    (_state: RootState, sport: string) => sport
  ],
  (matches, sport) => matches.filter((m) => m.sport === sport)
);

// Use in component
const Component = () => {
  const basketballMatches = useAppSelector((state) =>
    selectMatchesBySport(state, 'Basketball')
  );
};
```

### Composing Selectors

```typescript
// Base selectors
const selectUser = (state: RootState) => state.auth.user;
const selectAllMatches = (state: RootState) => state.matches.entities;

// Composed selector
export const selectUserMatches = createSelector(
  [selectUser, selectAllMatches],
  (user, matches) => {
    if (!user) return [];
    return matches.filter((m) =>
      m.participants.some((p) => p._id === user._id)
    );
  }
);
```

---

## RTK Query Integration

### API Slice Structure

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const matchApi = createApi({
  reducerPath: 'matchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['Match', 'Matches'],
  endpoints: (builder) => ({
    getMatches: builder.query<Match[], MatchFilters>({
      query: (filters) => `/matches?${params}`,
      providesTags: ['Matches'],
    }),
    createMatch: builder.mutation<Match, CreateMatchRequest>({
      query: (data) => ({
        url: '/matches',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Matches'],
    }),
  }),
});
```

### Using RTK Query Hooks

```typescript
import { useGetMatchesQuery, useCreateMatchMutation } from '@features/matches/store';

const Component = () => {
  // Query hook
  const { data, isLoading, error } = useGetMatchesQuery({ sport: 'Basketball' });
  
  // Mutation hook
  const [createMatch, { isLoading: creating }] = useCreateMatchMutation();
  
  const handleCreate = async () => {
    try {
      await createMatch(matchData).unwrap();
    } catch (err) {
      console.error('Failed:', err);
    }
  };
};
```

### Optimistic Updates

```typescript
joinMatch: builder.mutation<Match, string>({
  query: (id) => ({
    url: `/matches/${id}/join`,
    method: 'POST',
  }),
  async onQueryStarted(id, { dispatch, queryFulfilled }) {
    // Optimistic update
    const patchResult = dispatch(
      matchApi.util.updateQueryData('getMatch', id, (draft) => {
        draft.currentParticipants += 1;
      })
    );
    try {
      await queryFulfilled;
    } catch {
      // Rollback on error
      patchResult.undo();
    }
  },
  invalidatesTags: (result, error, id) => [{ type: 'Match', id }],
}),
```

---

## Working with Filters

### Filter State Pattern

```typescript
// In slice
const initialState = adapter.getInitialState({
  filters: {
    sport: null,
    status: null,
    location: null,
  },
});

// Reducer
setFilters: (state, action) => {
  state.filters = { ...state.filters, ...action.payload };
},
clearFilters: (state) => {
  state.filters = { sport: null, status: null, location: null };
},
```

### Filter Selector

```typescript
export const selectFilteredMatches = createSelector(
  [selectAllMatches, selectMatchesFilters],
  (matches, filters) => {
    let filtered = matches;
    
    if (filters.sport) {
      filtered = filtered.filter((m) => m.sport === filters.sport);
    }
    
    if (filters.status) {
      filtered = filtered.filter((m) => m.status === filters.status);
    }
    
    return filtered;
  }
);
```

### Using Filters in Component

```typescript
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setFilters, selectFilteredMatches } from '@features/matches/store';

const FilterableList = () => {
  const dispatch = useAppDispatch();
  const matches = useAppSelector(selectFilteredMatches);
  
  const handleSportFilter = (sport: string) => {
    dispatch(setFilters({ sport }));
  };
  
  return (
    <>
      <FilterBar onFilterChange={handleSportFilter} />
      <MatchList matches={matches} />
    </>
  );
};
```

---

## Performance Optimization

### Selector Memoization

Selectors automatically memoize results:

```typescript
// This selector only recomputes when `matches` array changes
const selectUpcomingMatches = createSelector(
  [selectAllMatches],
  (matches) => matches.filter((m) => m.status === 'upcoming')
);
```

**Benefits:**
- Prevents unnecessary recalculations
- Components only re-render when result changes
- Efficient even with large datasets

### Avoiding Re-renders

```typescript
// ❌ Bad: Creates new array every render
const Component = () => {
  const matches = useAppSelector((state) => 
    state.matches.entities.filter(m => m.status === 'upcoming')
  );
};

// ✅ Good: Uses memoized selector
const Component = () => {
  const matches = useAppSelector(selectUpcomingMatches);
};
```

### Selecting Minimal Data

```typescript
// ❌ Bad: Selects entire object, re-renders when any property changes
const user = useAppSelector(selectUser);
const userName = user?.name;

// ✅ Good: Selects only needed property
const userName = useAppSelector(selectUserName);
```

---

## Common Patterns

### Loading States

```typescript
// In component
const { data, isLoading, isFetching, isError } = useGetMatchesQuery();

if (isLoading) return <LoadingSpinner />;
if (isError) return <ErrorMessage />;
if (!data) return null;

return <MatchList matches={data} />;
```

### Error Handling

```typescript
const [createMatch, { error, isError }] = useCreateMatchMutation();

const handleSubmit = async (data) => {
  try {
    await createMatch(data).unwrap();
    showToast('Match created!', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
};
```

### Pagination

```typescript
const [page, setPage] = useState(1);
const { data } = useGetMatchesQuery({ page, limit: 20 });

const loadMore = () => setPage(p => p + 1);
```

### Search with Debouncing

```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

const { data } = useGetMatchesQuery({ 
  search: debouncedSearch 
}, {
  skip: !debouncedSearch,
});
```

---

## Testing

### Testing Selectors

```typescript
import { selectUpcomingMatches } from './matchesSelectors';

describe('selectUpcomingMatches', () => {
  it('filters upcoming matches', () => {
    const state = {
      matches: {
        ids: ['1', '2', '3'],
        entities: {
          '1': { _id: '1', status: 'upcoming' },
          '2': { _id: '2', status: 'completed' },
          '3': { _id: '3', status: 'upcoming' },
        },
      },
    };
    
    const result = selectUpcomingMatches(state);
    expect(result).toHaveLength(2);
    expect(result[0].status).toBe('upcoming');
  });
});
```

### Testing with Mock Store

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

const mockStore = configureStore({
  reducer: {
    matches: matchesReducer,
  },
  preloadedState: {
    matches: {
      ids: ['1'],
      entities: { '1': mockMatch },
    },
  },
});

const wrapper = ({ children }) => (
  <Provider store={mockStore}>{children}</Provider>
);

render(<Component />, { wrapper });
```

---

## Best Practices

### Do's ✅

1. **Use selectors for derived data**
   ```typescript
   const total = useAppSelector(selectTotalMatches);
   ```

2. **Memoize expensive computations**
   ```typescript
   const stats = useAppSelector(selectMatchesStats);
   ```

3. **Keep selectors pure**
   ```typescript
   // No side effects, always returns same output for same input
   ```

4. **Use TypeScript**
   ```typescript
   const user = useAppSelector(selectUser) as User;
   ```

5. **Normalize data with entity adapters**
   ```typescript
   const adapter = createEntityAdapter<Team>();
   ```

### Don'ts ❌

1. **Don't compute in components**
   ```typescript
   // ❌ Bad
   const upcoming = matches.filter(m => m.status === 'upcoming');
   
   // ✅ Good
   const upcoming = useAppSelector(selectUpcomingMatches);
   ```

2. **Don't create new objects in selectors**
   ```typescript
   // ❌ Bad: Creates new object every time
   return { ...match };
   
   // ✅ Good: Return existing reference if unchanged
   return match;
   ```

3. **Don't select entire state tree**
   ```typescript
   // ❌ Bad
   const state = useAppSelector(state => state);
   
   // ✅ Good
   const matches = useAppSelector(selectAllMatches);
   ```

4. **Don't use RTK Query for local state**
   ```typescript
   // ❌ Bad: Use for server data
   // ✅ Good: Use Redux slices for UI state
   ```

---

## Feature State Organization

Each feature follows this structure:

```
features/[feature]/store/
├── [feature]Api.ts        # RTK Query API
├── [feature]Slice.ts      # Redux slice with entity adapter
├── [feature]Selectors.ts  # Reselect selectors
└── index.ts               # Exports
```

**Example - Matches:**
```
features/matches/store/
├── matchApi.ts            # Match API endpoints
├── recommendationApi.ts   # Recommendation endpoints
├── matchesSlice.ts        # Match state slice
├── matchesSelectors.ts    # Match selectors
└── index.ts               # Barrel export
```

---

## Summary

### When to Use What

| Need | Solution |
|------|----------|
| Fetch from API | RTK Query |
| Store normalized data | Entity Adapter |
| Filter/sort data | Reselect Selector |
| Combine multiple slices | Composed Selector |
| UI state (filters, etc.) | Redux Slice |
| Instant feedback | Optimistic Update |

### State Management Checklist

- [ ] API calls use RTK Query
- [ ] Entities use entity adapters
- [ ] Derived data uses selectors
- [ ] Selectors are memoized
- [ ] TypeScript types defined
- [ ] Optimistic updates for UX
- [ ] Error handling implemented
- [ ] Loading states managed

---

**For more information:**
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [RTK Query Docs](https://redux-toolkit.js.org/rtk-query/overview)
- [Reselect Docs](https://github.com/reduxjs/reselect)
- [PHASE_5_SUMMARY.md](./PHASE_5_SUMMARY.md)
