import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@core';

/**
 * Storage utility functions for AsyncStorage operations with type safety
 */

/**
 * Save data to storage
 */
export const saveData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    logger.error(`Error saving data for key "${key}":`, error instanceof Error ? error : undefined);
    throw error;
  }
};

/**
 * Load data from storage
 */
export const loadData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    logger.error(`Error loading data for key "${key}":`, error instanceof Error ? error : undefined);
    return null;
  }
};

/**
 * Load data with default value
 */
export const loadDataWithDefault = async <T>(key: string, defaultValue: T): Promise<T> => {
  const data = await loadData<T>(key);
  return data !== null ? data : defaultValue;
};

/**
 * Remove data from storage
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    logger.error(`Error removing data for key "${key}":`, error instanceof Error ? error : undefined);
    throw error;
  }
};

/**
 * Clear all storage data
 */
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    logger.error('Error clearing storage:', error instanceof Error ? error : undefined);
    throw error;
  }
};

/**
 * Get all storage keys
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    logger.error('Error getting all keys:', error instanceof Error ? error : undefined);
    return [];
  }
};

/**
 * Check if key exists in storage
 */
export const hasKey = async (key: string): Promise<boolean> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.includes(key);
  } catch (error) {
    logger.error(`Error checking if key "${key}" exists:`, error instanceof Error ? error : undefined);
    return false;
  }
};

/**
 * Get multiple items from storage
 */
export const getMultiple = async <T>(keys: string[]): Promise<Record<string, T | null>> => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, T | null> = {};
    
    pairs.forEach(([key, value]) => {
      try {
        result[key] = value ? JSON.parse(value) : null;
      } catch {
        result[key] = null;
      }
    });
    
    return result;
  } catch (error) {
    logger.error('Error getting multiple items:', error instanceof Error ? error : undefined);
    return {};
  }
};

/**
 * Set multiple items in storage
 */
export const setMultiple = async (items: Record<string, any>): Promise<void> => {
  try {
    const pairs = Object.entries(items).map(([key, value]) => [
      key,
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiSet(pairs);
  } catch (error) {
    logger.error('Error setting multiple items:', error instanceof Error ? error : undefined);
    throw error;
  }
};

/**
 * Remove multiple items from storage
 */
export const removeMultiple = async (keys: string[]): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    logger.error('Error removing multiple items:', error instanceof Error ? error : undefined);
    throw error;
  }
};

/**
 * Merge data with existing data in storage
 */
export const mergeData = async <T extends object>(key: string, data: Partial<T>): Promise<void> => {
  try {
    const existing = await loadData<T>(key);
    const merged = { ...existing, ...data };
    await saveData(key, merged);
  } catch (error) {
    logger.error(`Error merging data for key "${key}":`, error instanceof Error ? error : undefined);
    throw error;
  }
};

/**
 * Save data with expiration time (in milliseconds)
 */
export const saveWithExpiry = async <T>(key: string, data: T, ttl: number): Promise<void> => {
  try {
    const now = new Date().getTime();
    const item = {
      value: data,
      expiry: now + ttl,
    };
    await saveData(key, item);
  } catch (error) {
    logger.error(`Error saving data with expiry for key "${key}":`, error instanceof Error ? error : undefined);
    throw error;
  }
};

/**
 * Load data with expiration check
 */
export const loadWithExpiry = async <T>(key: string): Promise<T | null> => {
  try {
    const item = await loadData<{ value: T; expiry: number }>(key);
    
    if (!item) {
      return null;
    }
    
    const now = new Date().getTime();
    
    if (now > item.expiry) {
      // Data has expired, remove it
      await removeData(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    logger.error(`Error loading data with expiry for key "${key}":`, error instanceof Error ? error : undefined);
    return null;
  }
};

/**
 * Get storage size estimate (in bytes)
 */
export const getStorageSize = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    
    let size = 0;
    pairs.forEach(([key, value]) => {
      size += key.length + (value?.length || 0);
    });
    
    return size;
  } catch (error) {
    logger.error('Error calculating storage size:', error instanceof Error ? error : undefined);
    return 0;
  }
};

/**
 * Storage keys constants for better type safety
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  LAST_SYNC: 'last_sync',
  CACHED_DATA: 'cached_data',
  SEARCH_HISTORY: 'search_history',
  FILTER_PREFERENCES: 'filter_preferences',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

/**
 * Type-safe storage wrapper class
 */
export class TypedStorage<T> {
  constructor(private key: string) {}
  
  async save(data: T): Promise<void> {
    return saveData(this.key, data);
  }
  
  async load(): Promise<T | null> {
    return loadData<T>(this.key);
  }
  
  async loadWithDefault(defaultValue: T): Promise<T> {
    return loadDataWithDefault(this.key, defaultValue);
  }
  
  async remove(): Promise<void> {
    return removeData(this.key);
  }
  
  async exists(): Promise<boolean> {
    return hasKey(this.key);
  }
  
  async merge(data: Partial<T>): Promise<void> {
    return mergeData(this.key, data as Partial<T & object>);
  }
}
