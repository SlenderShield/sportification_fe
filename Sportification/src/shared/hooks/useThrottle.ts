import { useCallback, useRef } from 'react';

/**
 * Hook for throttling a callback function
 * 
 * @param callback Function to throttle
 * @param delay Delay in milliseconds
 * @returns Throttled callback
 * 
 * @example
 * ```typescript
 * const handleScroll = useThrottle(() => {
 *   logger.log('Scroll event');
 * }, 200);
 * 
 * <ScrollView onScroll={handleScroll} />
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}
