import { useState, useCallback } from 'react';

export interface UseResourceOptions {
  autoFetch?: boolean;
}

export interface UseResourceReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook for fetching and managing resource state
 * 
 * @param fetcher Function that returns a Promise with the data
 * @param options Configuration options
 * @returns Resource state and refetch function
 * 
 * @example
 * ```typescript
 * const { data, loading, error, refetch } = useResource(
 *   () => apiService.getMatches(),
 *   { autoFetch: true }
 * );
 * ```
 */
export function useResource<T>(
  fetcher: () => Promise<T>,
  options?: UseResourceOptions
): UseResourceReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options?.autoFetch || false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  // Auto-fetch on mount if enabled
  useState(() => {
    if (options?.autoFetch) {
      fetch();
    }
  });

  return { data, loading, error, refetch: fetch };
}
