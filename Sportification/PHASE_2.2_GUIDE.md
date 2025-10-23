# Phase 2.2: Extract Presentation Components - Implementation Guide

## Overview
Phase 2.2 focuses on separating presentation logic from business logic using the Container/Presentation pattern. This creates testable, reusable components and makes the codebase more maintainable.

## Pattern: Container/Presentation

### Container Components (Logic)
- Manage state and business logic
- Handle data fetching
- Contain side effects
- Pass data and callbacks to presentation components

### Presentation Components (UI)
- Pure, stateless components
- Receive data via props
- Focus on rendering UI
- Easy to test and style

## Implementation Example: MatchesScreen

### Before (Mixed Concerns)
```typescript
// MatchesScreen.tsx - Contains both logic and UI
const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetMatchesQuery({ page, limit: 10 });
  
  const matches = data?.data?.items || [];
  
  // Business logic mixed with render
  const getStatusVariant = (status: string) => { ... };
  const renderMatchItem = ({ item, index }: any) => { ... };
  
  return (
    <View>
      <FlatList data={matches} renderItem={renderMatchItem} />
      <FAB onPress={() => navigation.navigate('CreateMatch')} />
    </View>
  );
};
```

**Problems:**
- Hard to test business logic
- Difficult to reuse UI components
- Mixed responsibilities (SRP violation)
- Hard to modify without affecting both logic and UI

### After (Separated Concerns)

#### Step 1: Extract Logic into Hook

```typescript
// features/matches/hooks/useMatchesScreen.ts
export function useMatchesScreen(navigation: any) {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetMatchesQuery({ page, limit: 10 });

  const matches = data?.data?.items || [];

  const handleMatchPress = useCallback(
    (matchId: string) => {
      navigation.navigate('MatchDetail', { matchId });
    },
    [navigation]
  );

  const handleCreateMatch = useCallback(() => {
    navigation.navigate('CreateMatch');
  }, [navigation]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const getStatusVariant = useCallback((status: string) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'in_progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  }, []);

  return {
    matches,
    isLoading,
    onMatchPress: handleMatchPress,
    onCreateMatch: handleCreateMatch,
    onRefresh: handleRefresh,
    getStatusVariant,
  };
}
```

#### Step 2: Create Presentation Component (Optional)

```typescript
// features/matches/components/MatchesView.tsx
interface MatchesViewProps {
  matches: Match[];
  isLoading: boolean;
  onMatchPress: (matchId: string) => void;
  onCreateMatch: () => void;
  onRefresh: () => void;
  getStatusVariant: (status: string) => string;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  isLoading,
  onMatchPress,
  onCreateMatch,
  onRefresh,
  getStatusVariant,
}) => {
  const { theme } = useTheme();
  
  if (isLoading && matches.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={matches}
        renderItem={({ item, index }) => (
          <MatchCard
            match={item}
            index={index}
            onPress={() => onMatchPress(item.id)}
            getStatusVariant={getStatusVariant}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="soccer-field"
            title="No matches found"
            message="Create your first match to get started"
          />
        }
      />
      <FAB icon="plus" onPress={onCreateMatch} variant="primary" />
    </View>
  );
};
```

#### Step 3: Container Component (Screen)

```typescript
// features/matches/screens/MatchesScreen.tsx
const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const screenProps = useMatchesScreen(navigation);
  return <MatchesView {...screenProps} />;
};

export default MatchesScreen;
```

## Benefits

### 1. Single Responsibility
- Hook manages state and business logic
- Component focuses on UI rendering
- Each piece has one reason to change

### 2. Testability
```typescript
// Easy to test hook in isolation
describe('useMatchesScreen', () => {
  it('should handle match press', () => {
    const { result } = renderHook(() => useMatchesScreen(mockNavigation));
    act(() => result.current.onMatchPress('123'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('MatchDetail', { matchId: '123' });
  });
});

// Easy to test presentation component
describe('MatchesView', () => {
  it('should render matches', () => {
    const { getByText } = render(
      <MatchesView matches={mockMatches} isLoading={false} {...mockCallbacks} />
    );
    expect(getByText('Match Title')).toBeTruthy();
  });
});
```

### 3. Reusability
- Hook can be used in different contexts
- Presentation component can be reused with different data sources
- Easy to create variants of the same UI

### 4. Maintainability
- Clear separation makes code easier to understand
- Changes to logic don't affect UI
- Changes to UI don't affect logic
- Easier to debug issues

## Implementation Strategy

### Phase 2.2 can be done incrementally:

1. **Create hooks as needed** when refactoring screens
2. **Extract complex logic** first (data fetching, transformations)
3. **Keep simple screens simple** - not everything needs separation
4. **Document patterns** for consistency

### When to Apply This Pattern

**✅ Good candidates:**
- Screens with complex business logic
- Screens with multiple data sources
- Screens that need testing
- Screens with reusable logic

**❌ Skip for:**
- Simple static screens
- Screens with minimal logic
- One-off screens
- Prototype screens

## Examples Created

### 1. useMatchesScreen Hook ✅
- Location: `features/matches/hooks/useMatchesScreen.ts`
- Purpose: Demonstrates logic extraction
- Benefits: Testable, reusable, clean

## Next Steps

### To fully implement Phase 2.2:

1. **Identify complex screens** that would benefit from separation
2. **Extract hooks** for business logic
3. **Create presentation components** for reusable UI
4. **Add tests** for both hooks and components
5. **Document patterns** in team guidelines

### Priority Screens for Refactoring:
- MatchDetailScreen (complex with multiple states)
- CreateMatchScreen (complex form logic)
- TournamentDetailScreen (complex bracket logic)
- ProfileScreen (multiple data sources)

## Best Practices

### 1. Hook Naming
- Use `use` prefix: `useMatchesScreen`, `useMatchDetail`
- Be specific: `useMatchFilters` not `useFilters`
- One hook per screen or feature area

### 2. Props Interface
- Define clear TypeScript interfaces
- Use meaningful prop names
- Group related props
- Document complex props

### 3. Callbacks
- Use `useCallback` for stable references
- Memoize expensive computations with `useMemo`
- Keep callbacks simple and focused

### 4. Testing
- Test hooks with `@testing-library/react-hooks`
- Test components with `@testing-library/react-native`
- Mock external dependencies
- Test error states and edge cases

## Conclusion

Phase 2.2 establishes a pattern for separating concerns in React components. While not all screens need immediate refactoring, the pattern is available and documented for use when:
- Complexity increases
- Testing becomes important
- Reusability is needed
- Maintenance becomes difficult

The example implementation (useMatchesScreen) demonstrates the pattern and can be used as a template for future refactoring.

---

**Phase 2.2 Status**: ✅ **PATTERN ESTABLISHED**  
**Implementation**: Can be applied incrementally as needed  
**Documentation**: Complete with examples and best practices
