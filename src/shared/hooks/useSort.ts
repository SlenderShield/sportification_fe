import { useState, useCallback } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface UseSortReturn<T> {
  sortKey: keyof T | null;
  sortDirection: SortDirection;
  sortData: (data: T[]) => T[];
  setSortKey: (key: keyof T) => void;
  toggleDirection: () => void;
  reset: () => void;
}

/**
 * Hook for managing sorting state and logic
 * 
 * @returns Sort state and control functions
 * 
 * @example
 * ```typescript
 * const { sortData, setSortKey, sortDirection } = useSort<Match>();
 * const sortedMatches = sortData(matches);
 * 
 * <Button onPress={() => setSortKey('date')}>
 *   Sort by Date {sortDirection === 'asc' ? '↑' : '↓'}
 * </Button>
 * ```
 */
export function useSort<T>(): UseSortReturn<T> {
  const [sortKey, setSortKeyState] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const setSortKey = useCallback((key: keyof T) => {
    setSortKeyState(prevKey => {
      // Toggle direction if same key
      if (prevKey === key) {
        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortDirection('asc');
      }
      return key;
    });
  }, []);

  const toggleDirection = useCallback(() => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const sortData = useCallback(
    (data: T[]) => {
      if (!sortKey) return data;

      return [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal === bVal) return 0;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    },
    [sortKey, sortDirection]
  );

  const reset = useCallback(() => {
    setSortKeyState(null);
    setSortDirection('asc');
  }, []);

  return {
    sortKey,
    sortDirection,
    sortData,
    setSortKey,
    toggleDirection,
    reset,
  };
}
