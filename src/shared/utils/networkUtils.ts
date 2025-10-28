import { logger } from '@core';
import NetInfo from '@react-native-community/netinfo';

/**
 * Network utility functions for network status and operations
 */

/**
 * Check if device is connected to the internet
 */
export const isOnline = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable === true;
  } catch (error) {
    logger.error('Error checking online status:', error);
    return false;
  }
};

/**
 * Check if device is offline
 */
export const isOffline = async (): Promise<boolean> => {
  const online = await isOnline();
  return !online;
};

/**
 * Get current network state
 */
export const getNetworkState = async () => {
  try {
    return await NetInfo.fetch();
  } catch (error) {
    logger.error('Error getting network state:', error);
    return null;
  }
};

/**
 * Subscribe to network state changes
 */
export const subscribeToNetworkState = (callback: (isConnected: boolean) => void) => {
  return NetInfo.addEventListener(state => {
    const isConnected = state.isConnected === true && state.isInternetReachable === true;
    callback(isConnected);
  });
};

/**
 * Retry a function until it succeeds or max attempts reached
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> => {
  let attempt = 0;
  let currentDelay = delay;
  
  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      if (attempt >= maxAttempts) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }
  
  throw new Error('Max retry attempts reached');
};

/**
 * Execute function only when online
 */
export const executeWhenOnline = async <T>(fn: () => Promise<T>): Promise<T> => {
  const online = await isOnline();
  
  if (!online) {
    throw new Error('Device is offline');
  }
  
  return fn();
};

/**
 * Wait for online connection
 */
export const waitForOnline = (timeout: number = 30000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      unsubscribe();
      reject(new Error('Timeout waiting for online connection'));
    }, timeout);
    
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        clearTimeout(timeoutId);
        unsubscribe();
        resolve();
      }
    });
  });
};

/**
 * Check network speed (rough estimate based on connection type)
 */
export const getNetworkSpeed = async (): Promise<'slow' | 'medium' | 'fast' | 'unknown'> => {
  try {
    const state = await NetInfo.fetch();
    
    if (!state.isConnected) {
      return 'unknown';
    }
    
    const type = state.type;
    const effectiveType = state.details?.cellularGeneration;
    
    // WiFi is generally fast
    if (type === 'wifi') {
      return 'fast';
    }
    
    // Cellular speeds
    if (type === 'cellular') {
      if (effectiveType === '5g') return 'fast';
      if (effectiveType === '4g') return 'medium';
      if (effectiveType === '3g') return 'slow';
      return 'medium';
    }
    
    return 'unknown';
  } catch (error) {
    logger.error('Error getting network speed:', error);
    return 'unknown';
  }
};

/**
 * Check if connection is metered (e.g., cellular data)
 */
export const isMeteredConnection = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.type === 'cellular';
  } catch (error) {
    logger.error('Error checking if connection is metered:', error);
    return false;
  }
};

/**
 * Parse URL query parameters
 */
export const parseQueryParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  
  try {
    const queryString = url.split('?')[1];
    if (!queryString) return params;
    
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });
  } catch (error) {
    logger.error('Error parsing query params:', error);
  }
  
  return params;
};

/**
 * Build URL with query parameters
 */
export const buildUrl = (baseUrl: string, params: Record<string, any>): string => {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
};

/**
 * Extract domain from URL
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return '';
  }
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return !!urlObj;
  } catch {
    return false;
  }
};

/**
 * Download retry with progress
 */
export const downloadWithRetry = async (
  url: string,
  onProgress?: (progress: number) => void,
  maxRetries: number = 3
): Promise<Blob> => {
  return retryWithBackoff(async () => {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get('Content-Length') ?? 0);
    
    if (!reader) {
      return response.blob();
    }
    
    let receivedLength = 0;
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      if (onProgress && contentLength > 0) {
        onProgress((receivedLength / contentLength) * 100);
      }
    }
    
    const blob = new Blob(chunks);
    return blob;
  }, maxRetries);
};

/**
 * Check if URL is secure (HTTPS)
 */
export const isSecureUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitize URL (remove query params and fragments)
 */
export const sanitizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
  } catch {
    return url;
  }
};
