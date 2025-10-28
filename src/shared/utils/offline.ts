import { logger } from "@core";
/**
 * Offline Support Utilities
 * Provides utilities for handling offline functionality
 */

import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Network status hook
 * Monitors network connectivity and returns online/offline status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnline(state.isConnected ?? true);
      setIsInternetReachable(state.isInternetReachable ?? true);
    });

    return () => unsubscribe();
  }, []);

  return {
    isOnline,
    isInternetReachable,
    isFullyOnline: isOnline && isInternetReachable,
  };
};

/**
 * Offline Action Queue
 * Queues actions when offline and executes them when back online
 */

interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retryCount: number;
}

const QUEUE_STORAGE_KEY = '@offline_action_queue';
const MAX_RETRY_COUNT = 3;

export class OfflineActionQueue {
  private static instance: OfflineActionQueue;
  private queue: QueuedAction[] = [];
  private isProcessing = false;

  private constructor() {
    this.loadQueue();
  }

  static getInstance(): OfflineActionQueue {
    if (!OfflineActionQueue.instance) {
      OfflineActionQueue.instance = new OfflineActionQueue();
    }
    return OfflineActionQueue.instance;
  }

  /**
   * Load queue from AsyncStorage
   */
  private async loadQueue() {
    try {
      const queueData = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (queueData) {
        this.queue = JSON.parse(queueData);
      }
    } catch (error) {
      logger.error('Failed to load offline queue:', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Save queue to AsyncStorage
   */
  private async saveQueue() {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      logger.error('Failed to save offline queue:', error instanceof Error ? error : undefined);
    }
  }

  /**
   * Add action to queue
   */
  async addAction(type: string, payload: any): Promise<string> {
    const action: QueuedAction = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(action);
    await this.saveQueue();
    return action.id;
  }

  /**
   * Process queue when online
   */
  async processQueue(
    executor: (action: QueuedAction) => Promise<boolean>
  ): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    const processedActions: string[] = [];
    const failedActions: QueuedAction[] = [];

    for (const action of this.queue) {
      try {
        const success = await executor(action);
        if (success) {
          processedActions.push(action.id);
        } else {
          action.retryCount++;
          if (action.retryCount >= MAX_RETRY_COUNT) {
            processedActions.push(action.id); // Remove after max retries
          } else {
            failedActions.push(action);
          }
        }
      } catch (error) {
        logger.error(`Failed to process action ${action.id}:`, error instanceof Error ? error : undefined);
        action.retryCount++;
        if (action.retryCount < MAX_RETRY_COUNT) {
          failedActions.push(action);
        } else {
          processedActions.push(action.id); // Remove after max retries
        }
      }
    }

    // Update queue - keep only failed actions that haven't exceeded retry limit
    this.queue = failedActions;
    await this.saveQueue();

    this.isProcessing = false;
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Clear queue
   */
  async clearQueue(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
  }

  /**
   * Get all queued actions
   */
  getQueuedActions(): QueuedAction[] {
    return [...this.queue];
  }
}

/**
 * Offline data cache utilities
 */
const CACHE_PREFIX = '@offline_cache_';
const CACHE_TIMESTAMP_SUFFIX = '_timestamp';
const DEFAULT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const OfflineCache = {
  /**
   * Set cached data
   */
  async set(key: string, data: any, _duration: number = DEFAULT_CACHE_DURATION): Promise<void> {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const timestampKey = `${cacheKey}${CACHE_TIMESTAMP_SUFFIX}`;
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      await AsyncStorage.setItem(timestampKey, Date.now().toString());
    } catch (error) {
      logger.error(`Failed to cache data for key ${key}:`, error instanceof Error ? error : undefined);
    }
  },

  /**
   * Get cached data
   */
  async get<T>(key: string, maxAge: number = DEFAULT_CACHE_DURATION): Promise<T | null> {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const timestampKey = `${cacheKey}${CACHE_TIMESTAMP_SUFFIX}`;
      
      const [dataStr, timestampStr] = await Promise.all([
        AsyncStorage.getItem(cacheKey),
        AsyncStorage.getItem(timestampKey),
      ]);

      if (!dataStr || !timestampStr) {
        return null;
      }

      const timestamp = parseInt(timestampStr, 10);
      const age = Date.now() - timestamp;

      if (age > maxAge) {
        // Cache expired
        await this.remove(key);
        return null;
      }

      return JSON.parse(dataStr) as T;
    } catch (error) {
      logger.error(`Failed to get cached data for key ${key}:`, error instanceof Error ? error : undefined);
      return null;
    }
  },

  /**
   * Remove cached data
   */
  async remove(key: string): Promise<void> {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const timestampKey = `${cacheKey}${CACHE_TIMESTAMP_SUFFIX}`;
      
      await Promise.all([
        AsyncStorage.removeItem(cacheKey),
        AsyncStorage.removeItem(timestampKey),
      ]);
    } catch (error) {
      logger.error(`Failed to remove cached data for key ${key}:`, error instanceof Error ? error : undefined);
    }
  },

  /**
   * Clear all cached data
   */
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      logger.error('Failed to clear all cached data:', error instanceof Error ? error : undefined);
    }
  },

  /**
   * Get cache age in milliseconds
   */
  async getCacheAge(key: string): Promise<number | null> {
    try {
      const timestampKey = `${CACHE_PREFIX}${key}${CACHE_TIMESTAMP_SUFFIX}`;
      const timestampStr = await AsyncStorage.getItem(timestampKey);
      
      if (!timestampStr) {
        return null;
      }

      const timestamp = parseInt(timestampStr, 10);
      return Date.now() - timestamp;
    } catch (error) {
      logger.error(`Failed to get cache age for key ${key}:`, error instanceof Error ? error : undefined);
      return null;
    }
  },
};

/**
 * Hook for managing offline data
 */
export const useOfflineData = <T,>(
  key: string,
  fetcher: () => Promise<T>,
  options: { maxAge?: number; enabled?: boolean } = {}
) => {
  const { maxAge = DEFAULT_CACHE_DURATION, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cacheAge, setCacheAge] = useState<number | null>(null);
  const { isFullyOnline } = useNetworkStatus();

  const fetchData = async (forceRefresh = false) => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Try to get cached data first
      if (!forceRefresh) {
        const cachedData = await OfflineCache.get<T>(key, maxAge);
        if (cachedData) {
          setData(cachedData);
          const age = await OfflineCache.getCacheAge(key);
          setCacheAge(age);
          setLoading(false);
          
          // If online, fetch fresh data in background
          if (isFullyOnline) {
            fetchFreshData();
          }
          return;
        }
      }

      // Fetch fresh data if online
      if (isFullyOnline) {
        await fetchFreshData();
      } else {
        throw new Error('No cached data available and device is offline');
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreshData = async () => {
    try {
      const freshData = await fetcher();
      setData(freshData);
      setCacheAge(0);
      await OfflineCache.set(key, freshData, maxAge);
    } catch (err) {
      if (!data) {
        // Only set error if we don't have cached data
        setError(err as Error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    cacheAge,
    isCached: cacheAge !== null && cacheAge > 0,
  };
};
