import { useState, useCallback } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  reset: () => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
}

/**
 * Hook for managing pagination state
 * 
 * @param options Configuration options
 * @returns Pagination state and control functions
 * 
 * @example
 * ```typescript
 * const { page, pageSize, nextPage, prevPage, hasMore } = usePagination({
 *   initialPage: 1,
 *   pageSize: 20
 * });
 * ```
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { initialPage = 1, pageSize = 10 } = options;
  
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [hasMore]);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
  }, [initialPage]);

  return {
    page,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    reset,
    hasMore,
    setHasMore,
  };
}
