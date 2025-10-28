import { logger } from '@core';
/**
 * Performance optimization utilities
 * 
 * This module provides utilities for monitoring and optimizing React Native app performance.
 */

import { InteractionManager } from 'react-native';

/**
 * Run a callback after interactions are complete
 * Useful for deferring non-critical work until after animations/gestures complete
 */
export const runAfterInteractions = (callback: () => void): Promise<void> => {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      callback();
      resolve();
    });
  });
};

/**
 * Debounce function execution
 * Delays execution until after a specified time has passed since the last call
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttle function execution
 * Ensures function is called at most once per specified time period
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Measure function execution time (development only)
 */
export const measurePerformance = async <T>(
  name: string,
  fn: () => T | Promise<T>
): Promise<T> => {
  if (__DEV__) {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      logger.log(`[Performance] ${name}: ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.log(`[Performance] ${name} failed after: ${duration}ms`);
      throw error;
    }
  } else {
    return await fn();
  }
};

/**
 * Create a memoized version of a function
 * Caches results based on arguments
 */
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  getCacheKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getCacheKey ? getCacheKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Batch multiple state updates into a single render cycle
 */
export const batchUpdates = (callback: () => void): void => {
  // React Native automatically batches updates in event handlers
  // This is a placeholder for consistency with web React patterns
  callback();
};

/**
 * Check if app is running in production mode
 */
export const isProduction = (): boolean => {
  return !__DEV__;
};

/**
 * Check if app is running in development mode
 */
export const isDevelopment = (): boolean => {
  return __DEV__;
};

/**
 * Create a stable reference that only changes when dependencies change
 * Similar to React.useMemo but for non-hook contexts
 */
export class StableReference<T> {
  private value: T;
  private dependencies: any[];

  constructor(value: T, dependencies: any[] = []) {
    this.value = value;
    this.dependencies = dependencies;
  }

  get(newValue: T, newDependencies: any[] = []): T {
    if (this.haveDependenciesChanged(newDependencies)) {
      this.value = newValue;
      this.dependencies = newDependencies;
    }
    return this.value;
  }

  private haveDependenciesChanged(newDependencies: any[]): boolean {
    if (this.dependencies.length !== newDependencies.length) {
      return true;
    }

    return this.dependencies.some(
      (dep, index) => dep !== newDependencies[index]
    );
  }
}

/**
 * Simple performance monitor for tracking metrics
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  mark(name: string): void {
    const timestamp = Date.now();
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(timestamp);
  }

  measure(name: string, startMark: string, endMark: string): number | null {
    const startTimes = this.metrics.get(startMark);
    const endTimes = this.metrics.get(endMark);

    if (!startTimes || !endTimes || startTimes.length === 0 || endTimes.length === 0) {
      return null;
    }

    const duration = endTimes[endTimes.length - 1] - startTimes[startTimes.length - 1];
    
    if (__DEV__) {
      logger.log(`[Performance] ${name}: ${duration}ms`);
    }

    return duration;
  }

  getMetrics(name: string): number[] {
    return this.metrics.get(name) || [];
  }

  clear(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }

  getAverageDuration(startMark: string, endMark: string): number | null {
    const startTimes = this.metrics.get(startMark);
    const endTimes = this.metrics.get(endMark);

    if (!startTimes || !endTimes || startTimes.length === 0 || endTimes.length === 0) {
      return null;
    }

    const durations: number[] = [];
    const minLength = Math.min(startTimes.length, endTimes.length);

    for (let i = 0; i < minLength; i++) {
      durations.push(endTimes[i] - startTimes[i]);
    }

    const sum = durations.reduce((acc, val) => acc + val, 0);
    return sum / durations.length;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Lazy initialize a value
 * Only computes the value when first accessed
 */
export class LazyValue<T> {
  private value: T | undefined;
  private initialized: boolean = false;
  private initializer: () => T;

  constructor(initializer: () => T) {
    this.initializer = initializer;
  }

  get(): T {
    if (!this.initialized) {
      this.value = this.initializer();
      this.initialized = true;
    }
    return this.value!;
  }

  reset(): void {
    this.value = undefined;
    this.initialized = false;
  }
}

/**
 * Check if two objects are shallowly equal
 * Useful for custom comparison in React.memo
 */
export const shallowEqual = (objA: any, objB: any): boolean => {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Create a debounced version of a value
 * Returns the value only after it hasn't changed for a specified duration
 */
export const createDebouncedValue = <T>(
  value: T,
  delay: number,
  callback: (value: T) => void
): void => {
  let timeout: NodeJS.Timeout;

  const debouncedUpdate = () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback(value);
    }, delay);
  };

  debouncedUpdate();
};
