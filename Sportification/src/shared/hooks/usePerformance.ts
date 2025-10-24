/**
 * React performance optimization hooks
 * 
 * Custom hooks for optimizing React Native component performance
 */

import { useCallback, useEffect, useRef, useMemo, DependencyList } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Hook that runs a callback after interactions are complete
 * Useful for deferring non-critical work
 */
export const useAfterInteractions = (callback: () => void, dependencies: DependencyList = []) => {
  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(callback);
    return () => handle.cancel();
    // Dependencies are passed as parameter and intentionally spread
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...dependencies]);
};

/**
 * Hook for debounced values
 * Returns a debounced version of the value that only updates after the specified delay
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for creating stable debounced callbacks
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: DependencyList = []
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    // Dependencies are intentionally spread for flexibility
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, delay, ...dependencies]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook for creating stable throttled callbacks
 */
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  dependencies: DependencyList = []
): T => {
  const inThrottle = useRef<boolean>(false);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    // Dependencies are intentionally spread for flexibility
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, limit, ...dependencies]
  ) as T;

  return throttledCallback;
};

/**
 * Hook for tracking previous value
 * Useful for comparing with current value to detect changes
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * Hook for lazy initialization
 * Only runs the initializer function once
 */
export const useLazyRef = <T>(initializer: () => T): T => {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = initializer();
  }

  return ref.current;
};

/**
 * Hook for memoizing expensive computations with custom equality check
 */
export const useMemoWithComparator = <T>(
  factory: () => T,
  deps: DependencyList,
  comparator: (a: DependencyList, b: DependencyList) => boolean
): T => {
  const ref = useRef<{ deps: DependencyList; value: T } | null>(null);

  if (!ref.current || !comparator(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory(),
    };
  }

  return ref.current.value;
};

/**
 * Hook for stable callbacks that don't cause re-renders
 * Similar to useCallback but doesn't require dependencies
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
};

/**
 * Hook for mounting/unmounting state
 * Useful for preventing state updates on unmounted components
 */
export const useIsMounted = (): (() => boolean) => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
};

/**
 * Hook for safe async state updates
 * Only updates state if component is still mounted
 */
export const useSafeState = <T>(
  initialState: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(initialState);
  const isMounted = useIsMounted();

  const setSafeState = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (isMounted()) {
        setState(value);
      }
    },
    [isMounted]
  );

  return [state, setSafeState];
};

/**
 * Hook for conditional rendering based on viewport visibility
 * Defers rendering until component is in viewport
 */
export const useDeferredRender = (delay: number = 0): boolean => {
  const [shouldRender, setShouldRender] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  return shouldRender;
};

/**
 * Hook for optimized list rendering
 * Returns windowed items for virtualization
 */
export const useWindowedList = <T>(
  items: T[],
  windowSize: number = 10,
  currentIndex: number = 0
): T[] => {
  return useMemo(() => {
    const start = Math.max(0, currentIndex - windowSize);
    const end = Math.min(items.length, currentIndex + windowSize);
    return items.slice(start, end);
  }, [items, windowSize, currentIndex]);
};

/**
 * Hook for performance monitoring
 * Logs render count in development mode
 */
export const useRenderCount = (componentName: string): void => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (__DEV__) {
      console.log(`[Render Count] ${componentName}: ${renderCount.current}`);
    }
  });
};

/**
 * Hook for detecting why a component re-rendered
 * Useful for debugging performance issues
 */
export const useWhyDidYouUpdate = (
  componentName: string,
  props: Record<string, any>
): void => {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current && __DEV__) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`[Why Updated] ${componentName}:`, changedProps);
      }
    }

    previousProps.current = props;
  });
};

// Re-export useState for useSafeState
import { useState } from 'react';
