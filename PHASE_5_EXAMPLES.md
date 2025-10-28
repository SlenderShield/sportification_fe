# Phase 5 Usage Examples

This document provides practical examples of using the Phase 5 state management improvements.

## Example 1: Using Entity Adapter Selectors in a Component

```typescript
// features/matches/screens/MatchesScreen.tsx
import React from 'react';
import { useAppSelector } from '@store/hooks';
import { 
  selectAllMatches, 
  selectMatchesLoading, 
  selectUpcomingMatches 
} from '@store/selectors';

const MatchesScreen: React.FC = () => {
  // Select all matches
  const allMatches = useAppSelector(selectAllMatches);
  
  // Select only upcoming matches (filtered and memoized)
  const upcomingMatches = useAppSelector(selectUpcomingMatches);
  
  // Select loading state
  const loading = useAppSelector(selectMatchesLoading);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <View>
      <Text>Total Matches: {allMatches.length}</Text>
      <Text>Upcoming: {upcomingMatches.length}</Text>
      <MatchList matches={upcomingMatches} />
    </View>
  );
};
```

## Example 2: Using Parameterized Selectors

```typescript
// components/BasketballMatches.tsx
import React from 'react';
import { useAppSelector } from '@store/hooks';
import { selectMatchesBySport } from '@store/selectors';

const BasketballMatches: React.FC = () => {
  // Pass parameter to selector
  const basketballMatches = useAppSelector((state) => 
    selectMatchesBySport(state, 'Basketball')
  );
  
  return <MatchList matches={basketballMatches} />;
};
```

## Example 3: Using Filters with Selectors

```typescript
// features/matches/screens/FilterableMatchesScreen.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { 
  setFilters, 
  clearFilters, 
  selectFilteredMatches,
  selectMatchesFilters 
} from '@features/matches/store';

const FilterableMatchesScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Select filtered matches
  const matches = useAppSelector(selectFilteredMatches);
  
  // Select current filters
  const filters = useAppSelector(selectMatchesFilters);
  
  const handleSportFilter = (sport: string) => {
    dispatch(setFilters({ sport }));
  };
  
  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status }));
  };
  
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  return (
    <View>
      <FilterBar 
        filters={filters}
        onSportChange={handleSportFilter}
        onStatusChange={handleStatusFilter}
        onClear={handleClearFilters}
      />
      <MatchList matches={matches} />
    </View>
  );
};
```

## Example 4: Using Entity Adapter Actions

```typescript
// features/matches/hooks/useMatchSync.ts
import { useEffect } from 'react';
import { useAppDispatch } from '@store/hooks';
import { matchesAdded, matchUpdated } from '@features/matches/store';
import { socketService } from '@shared/services';

export const useMatchSync = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Listen for match updates from socket
    const handleMatchUpdate = (match: Match) => {
      dispatch(matchUpdated({ id: match._id, changes: match }));
    };
    
    const handleNewMatches = (matches: Match[]) => {
      dispatch(matchesAdded(matches));
    };
    
    socketService.on('match:updated', handleMatchUpdate);
    socketService.on('matches:new', handleNewMatches);
    
    return () => {
      socketService.off('match:updated', handleMatchUpdate);
      socketService.off('matches:new', handleNewMatches);
    };
  }, [dispatch]);
};
```

## Example 5: Optimistic Updates with RTK Query

```typescript
// components/MatchJoinButton.tsx
import React from 'react';
import { useJoinMatchMutation } from '@features/matches/store';

const MatchJoinButton: React.FC<{ matchId: string }> = ({ matchId }) => {
  const [joinMatch, { isLoading }] = useJoinMatchMutation();
  
  const handleJoin = async () => {
    try {
      // Optimistic update happens automatically
      // UI updates immediately, then reverts if error
      await joinMatch(matchId).unwrap();
      showToast('Successfully joined match!', 'success');
    } catch (error) {
      showToast('Failed to join match', 'error');
    }
  };
  
  return (
    <Button 
      onPress={handleJoin} 
      loading={isLoading}
      disabled={isLoading}
    >
      Join Match
    </Button>
  );
};
```

## Example 6: Combining Multiple Selectors

```typescript
// features/profile/hooks/useUserStats.ts
import { useMemo } from 'react';
import { useAppSelector } from '@store/hooks';
import { 
  selectUser,
  selectAllMatches,
  selectAllTeams 
} from '@store/selectors';

export const useUserStats = () => {
  const user = useAppSelector(selectUser);
  const allMatches = useAppSelector(selectAllMatches);
  const allTeams = useAppSelector(selectAllTeams);
  
  const stats = useMemo(() => {
    if (!user) return null;
    
    // Calculate user-specific stats
    const matchesParticipated = allMatches.filter((match) =>
      match.participants.some((p) => p._id === user._id)
    ).length;
    
    const teamsJoined = allTeams.filter((team) =>
      team.members.some((m) => m.user._id === user._id)
    ).length;
    
    return {
      matchesParticipated,
      teamsJoined,
    };
  }, [user, allMatches, allTeams]);
  
  return stats;
};
```

## Example 7: Using Stats Selectors

```typescript
// features/dashboard/screens/DashboardScreen.tsx
import React from 'react';
import { useAppSelector } from '@store/hooks';
import { 
  selectMatchesStats,
  selectTeamsStats,
  selectTournamentsStats 
} from '@store/selectors';

const DashboardScreen: React.FC = () => {
  const matchStats = useAppSelector(selectMatchesStats);
  const teamStats = useAppSelector(selectTeamsStats);
  const tournamentStats = useAppSelector(selectTournamentsStats);
  
  return (
    <View>
      <StatsCard 
        title="Matches"
        total={matchStats.total}
        upcoming={matchStats.upcoming}
        active={matchStats.active}
      />
      <StatsCard 
        title="Teams"
        total={teamStats.total}
        active={teamStats.active}
        withOpenings={teamStats.withOpenings}
      />
      <StatsCard 
        title="Tournaments"
        total={tournamentStats.total}
        open={tournamentStats.open}
        active={tournamentStats.active}
      />
    </View>
  );
};
```

## Example 8: Custom Hook with Selectors and Actions

```typescript
// features/matches/hooks/useMatchFilters.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { 
  setFilters, 
  clearFilters,
  selectFilteredMatches,
  selectMatchesFilters 
} from '@features/matches/store';

export const useMatchFilters = () => {
  const dispatch = useAppDispatch();
  const matches = useAppSelector(selectFilteredMatches);
  const filters = useAppSelector(selectMatchesFilters);
  
  const setSportFilter = useCallback((sport: string | null) => {
    dispatch(setFilters({ sport }));
  }, [dispatch]);
  
  const setStatusFilter = useCallback((status: string | null) => {
    dispatch(setFilters({ status }));
  }, [dispatch]);
  
  const setLocationFilter = useCallback((location: string | null) => {
    dispatch(setFilters({ location }));
  }, [dispatch]);
  
  const clear = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);
  
  return {
    matches,
    filters,
    setSportFilter,
    setStatusFilter,
    setLocationFilter,
    clearFilters: clear,
  };
};

// Usage in component
const MatchesScreen = () => {
  const { matches, filters, setSportFilter, clearFilters } = useMatchFilters();
  
  return (
    <View>
      <FilterBar 
        selectedSport={filters.sport}
        onSportChange={setSportFilter}
        onClear={clearFilters}
      />
      <MatchList matches={matches} />
    </View>
  );
};
```

## Example 9: Selecting by ID with Safety

```typescript
// features/matches/screens/MatchDetailScreen.tsx
import React from 'react';
import { useAppSelector } from '@store/hooks';
import { selectMatchById } from '@store/selectors';

const MatchDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { matchId } = route.params;
  
  // Safely select match by ID
  const match = useAppSelector((state) => selectMatchById(state, matchId));
  
  if (!match) {
    return <NotFoundView />;
  }
  
  return <MatchDetails match={match} />;
};
```

## Example 10: Creating Derived Selectors

```typescript
// features/matches/store/customSelectors.ts
import { createSelector } from 'reselect';
import { selectUser } from '@features/auth/store';
import { selectAllMatches } from './matchesSelectors';

// Select matches the current user is participating in
export const selectMyMatches = createSelector(
  [selectUser, selectAllMatches],
  (user, matches) => {
    if (!user) return [];
    return matches.filter((match) =>
      match.participants.some((p) => p._id === user._id)
    );
  }
);

// Select matches the user is eligible to join
export const selectEligibleMatches = createSelector(
  [selectUser, selectAllMatches],
  (user, matches) => {
    if (!user) return [];
    return matches.filter((match) => {
      // Not full
      if (match.currentParticipants >= match.maxParticipants) return false;
      
      // Not already joined
      if (match.participants.some((p) => p._id === user._id)) return false;
      
      // Upcoming
      if (match.status !== 'upcoming') return false;
      
      return true;
    });
  }
);
```

## Performance Tips

### 1. Use Specific Selectors
```typescript
// ❌ Bad: Selects entire state, causes re-renders
const state = useAppSelector(state => state);
const userName = state.auth.user?.name;

// ✅ Good: Selects only what's needed
const userName = useAppSelector(selectUserName);
```

### 2. Memoize Expensive Operations
```typescript
// ✅ Good: Selector memoizes the filtering
const upcomingMatches = useAppSelector(selectUpcomingMatches);

// Instead of filtering in component
const upcomingMatches = matches.filter(m => m.status === 'upcoming');
```

### 3. Use Entity Adapters
```typescript
// ✅ Good: O(1) lookup
const match = useAppSelector(state => selectMatchById(state, matchId));

// Instead of array find
const match = matches.find(m => m._id === matchId);
```

---

These examples demonstrate the power and flexibility of the Phase 5 state management improvements. The combination of entity adapters, memoized selectors, and optimistic updates provides a robust, performant foundation for state management in the application.
