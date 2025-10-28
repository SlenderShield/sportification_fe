import React, { useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SearchBar } from '../molecules/SearchBar';
import { EmptyState } from '../molecules/EmptyState';
import { SkeletonLoader } from '../molecules/SkeletonLoader';
import { SectionHeader } from '../molecules/SectionHeader';
import { FilterChips } from '../organisms/FilterChips';
import { SortFilter } from '../organisms/SortFilter';
import { FAB } from '../organisms/FAB';

/**
 * ListScreenTemplate
 * 
 * Reusable template for list screens with common features:
 * - Search functionality
 * - Loading states
 * - Empty states
 * - Pull-to-refresh
 * - Filter chips
 * - Sort options
 * - Floating action button
 * 
 * @example
 * ```tsx
 * <ListScreenTemplate
 *   title="Teams"
 *   items={teams}
 *   renderItem={(team) => <TeamCard team={team} />}
 *   isLoading={isLoading}
 *   onRefresh={refetch}
 *   onSearch={handleSearch}
 *   onAddNew={handleCreateTeam}
 * />
 * ```
 */

export interface SortOption {
  key: string;
  label: string;
  direction: 'asc' | 'desc';
}

export interface ListScreenTemplateProps<T> {
  /** Screen title */
  title: string;
  /** Array of items to display */
  items: T[];
  /** Function to render each item */
  renderItem: (item: T) => React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Refresh callback */
  onRefresh?: () => void;
  /** Search callback */
  onSearch?: (query: string) => void;
  /** Filter change callback */
  onFilterChange?: (filters: string[]) => void;
  /** Sort change callback */
  onSortChange?: (sort: SortOption) => void;
  /** Add new item callback (shows FAB if provided) */
  onAddNew?: () => void;
  /** Empty state message */
  emptyMessage?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Available filters */
  filters?: Array<{ id: string; label: string }>;
  /** Available sort options */
  sortOptions?: SortOption[];
  /** Item key extractor */
  keyExtractor?: (item: T, index: number) => string;
}

export function ListScreenTemplate<T>({
  title,
  items,
  renderItem,
  isLoading = false,
  error,
  onRefresh,
  onSearch,
  onFilterChange,
  onSortChange,
  onAddNew,
  emptyMessage = 'No items found',
  searchPlaceholder = 'Search...',
  filters,
  sortOptions,
  keyExtractor = (_, index) => index.toString(),
}: ListScreenTemplateProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((f) => f !== filterId)
      : [...selectedFilters, filterId];
    
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <SectionHeader title={title} />
      
      {onSearch && (
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder={searchPlaceholder}
        />
      )}
      
      {filters && filters.length > 0 && (
        <FilterChips
          filters={filters}
          selectedFilters={selectedFilters}
          onFilterToggle={handleFilterToggle}
        />
      )}
      
      {sortOptions && sortOptions.length > 0 && onSortChange && (
        <SortFilter
          options={sortOptions}
          onSortChange={onSortChange}
        />
      )}
    </View>
  );

  const renderContent = () => {
    if (isLoading && items.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <SkeletonLoader count={5} />
        </View>
      );
    }

    if (error) {
      return (
        <EmptyState
          message={error}
          icon="alert-circle"
        />
      );
    }

    if (items.length === 0) {
      return (
        <EmptyState
          message={emptyMessage}
          icon="inbox"
        />
      );
    }

    return (
      <FlatList
        data={items}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          ) : undefined
        }
        ListHeaderComponent={renderHeader}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      
      {onAddNew && (
        <FAB
          icon="plus"
          onPress={onAddNew}
          style={styles.fab}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  loadingContainer: {
    padding: 16,
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
