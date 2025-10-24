import { logger } from '@core';
import { Image } from 'react-native';

/**
 * Image Preloading Utilities
 * 
 * Provides utilities to preload images for better performance.
 * Preloaded images are cached and load instantly when needed.
 */

interface PreloadResult {
  success: boolean;
  uri: string;
  error?: Error;
}

/**
 * Preload a single image
 * 
 * @param uri - Image URI to preload
 * @returns Promise that resolves when image is loaded
 * 
 * @example
 * ```typescript
 * await preloadImage('https://example.com/image.jpg');
 * ```
 */
export const preloadImage = (uri: string): Promise<PreloadResult> => {
  return new Promise((resolve) => {
    Image.prefetch(uri)
      .then(() => {
        resolve({
          success: true,
          uri,
        });
      })
      .catch((error) => {
        logger.warn(`Failed to preload image: ${uri}`, error);
        resolve({
          success: false,
          uri,
          error,
        });
      });
  });
};

/**
 * Preload multiple images in parallel
 * 
 * @param uris - Array of image URIs to preload
 * @returns Promise that resolves when all images are loaded (or failed)
 * 
 * @example
 * ```typescript
 * const results = await preloadImages([
 *   'https://example.com/image1.jpg',
 *   'https://example.com/image2.jpg',
 * ]);
 * logger.log(`Loaded ${results.filter(r => r.success).length} images`);
 * ```
 */
export const preloadImages = async (uris: string[]): Promise<PreloadResult[]> => {
  return Promise.all(uris.map(uri => preloadImage(uri)));
};

/**
 * Preload images with progress callback
 * 
 * @param uris - Array of image URIs to preload
 * @param onProgress - Callback called after each image loads
 * @returns Promise that resolves when all images are loaded
 * 
 * @example
 * ```typescript
 * await preloadImagesWithProgress(
 *   imageUrls,
 *   (loaded, total) => {
 *     logger.log(`Loading: ${loaded}/${total}`);
 *   }
 * );
 * ```
 */
export const preloadImagesWithProgress = async (
  uris: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<PreloadResult[]> => {
  const results: PreloadResult[] = [];
  let loaded = 0;

  for (const uri of uris) {
    const result = await preloadImage(uri);
    results.push(result);
    loaded++;
    onProgress?.(loaded, uris.length);
  }

  return results;
};

/**
 * Clear image cache (useful for freeing memory)
 * Note: This is a no-op on Android as React Native doesn't provide
 * a direct API to clear the cache. On iOS, you can use FastImage
 * library for more cache control.
 */
export const clearImageCache = (): void => {
  // React Native doesn't provide a built-in way to clear image cache
  // This is a placeholder for future implementation or third-party library integration
  logger.log('Image cache clearing is not directly supported in React Native');
};

/**
 * Get cache size estimate (not available in React Native by default)
 * This is a placeholder for future implementation
 */
export const getImageCacheSize = (): number => {
  // Not available in React Native by default
  return 0;
};

/**
 * Image compression utility
 * Generates URLs for different image sizes if your backend supports it
 * 
 * @param uri - Original image URI
 * @param width - Desired width
 * @param quality - Quality (0-100)
 * @returns Modified URI with size parameters
 * 
 * @example
 * ```typescript
 * // If your backend supports query parameters for resizing
 * const thumbnailUrl = getOptimizedImageUrl(originalUrl, 200, 80);
 * // Returns: originalUrl + '?w=200&q=80'
 * ```
 */
export const getOptimizedImageUrl = (
  uri: string,
  width?: number,
  quality: number = 80
): string => {
  // This is a generic implementation that adds query parameters
  // Modify this based on your image CDN/backend requirements
  const separator = uri.includes('?') ? '&' : '?';
  const params: string[] = [];
  
  if (width) {
    params.push(`w=${width}`);
  }
  
  params.push(`q=${quality}`);
  
  return params.length > 0 ? `${uri}${separator}${params.join('&')}` : uri;
};

/**
 * Generate responsive image URLs for different screen densities
 * 
 * @param baseUri - Base image URI
 * @param sizes - Array of sizes to generate
 * @returns Object with size keys and corresponding URIs
 * 
 * @example
 * ```typescript
 * const sources = getResponsiveImageSources(
 *   'https://example.com/image.jpg',
 *   [200, 400, 800]
 * );
 * // Returns: { 200: '...?w=200', 400: '...?w=400', 800: '...?w=800' }
 * ```
 */
export const getResponsiveImageSources = (
  baseUri: string,
  sizes: number[]
): Record<number, string> => {
  const sources: Record<number, string> = {};
  
  sizes.forEach(size => {
    sources[size] = getOptimizedImageUrl(baseUri, size);
  });
  
  return sources;
};
