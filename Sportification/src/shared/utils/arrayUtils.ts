/**
 * Array utility functions for common array operations
 */

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Remove duplicates from array by key
 */
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Group array by key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Chunk array into smaller arrays of specified size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random item from array
 */
export const randomItem = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get random items from array
 */
export const randomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Sort array by key
 */
export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Sort array by multiple keys
 */
export const sortByMultiple = <T>(array: T[], keys: (keyof T)[], directions?: ('asc' | 'desc')[]): T[] => {
  return [...array].sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const direction = directions?.[i] || 'asc';
      
      const aValue = a[key];
      const bValue = b[key];
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Find item by key-value pair
 */
export const findBy = <T>(array: T[], key: keyof T, value: any): T | undefined => {
  return array.find(item => item[key] === value);
};

/**
 * Filter array by multiple values for a key
 */
export const filterByValues = <T>(array: T[], key: keyof T, values: any[]): T[] => {
  return array.filter(item => values.includes(item[key]));
};

/**
 * Partition array into two based on predicate
 */
export const partition = <T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] => {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  array.forEach(item => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });
  
  return [truthy, falsy];
};

/**
 * Get first n items from array
 */
export const take = <T>(array: T[], count: number): T[] => {
  return array.slice(0, count);
};

/**
 * Get last n items from array
 */
export const takeLast = <T>(array: T[], count: number): T[] => {
  return array.slice(-count);
};

/**
 * Flatten nested array
 */
export const flatten = <T>(array: (T | T[])[]): T[] => {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

/**
 * Create array of numbers from start to end
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Sum array of numbers
 */
export const sum = (array: number[]): number => {
  return array.reduce((total, num) => total + num, 0);
};

/**
 * Calculate average of array of numbers
 */
export const average = (array: number[]): number => {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
};

/**
 * Get minimum value from array
 */
export const min = (array: number[]): number => {
  return Math.min(...array);
};

/**
 * Get maximum value from array
 */
export const max = (array: number[]): number => {
  return Math.max(...array);
};

/**
 * Count occurrences of each item in array
 */
export const countBy = <T>(array: T[], key?: keyof T): Record<string, number> => {
  return array.reduce((counts, item) => {
    const value = key ? String(item[key]) : String(item);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
};

/**
 * Check if arrays are equal (shallow comparison)
 */
export const arraysEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

/**
 * Get intersection of two arrays
 */
export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => arr2.includes(item));
};

/**
 * Get difference between two arrays (items in arr1 but not in arr2)
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => !arr2.includes(item));
};

/**
 * Get union of two arrays (all unique items from both)
 */
export const union = <T>(arr1: T[], arr2: T[]): T[] => {
  return unique([...arr1, ...arr2]);
};

/**
 * Compact array (remove falsy values)
 */
export const compact = <T>(array: (T | null | undefined | false | '' | 0)[]): T[] => {
  return array.filter(Boolean) as T[];
};

/**
 * Get nth item from array (supports negative indexing)
 */
export const nth = <T>(array: T[], index: number): T | undefined => {
  if (index < 0) {
    return array[array.length + index];
  }
  return array[index];
};

/**
 * Move item in array from one index to another
 */
export const move = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

/**
 * Insert item at index
 */
export const insertAt = <T>(array: T[], index: number, item: T): T[] => {
  const result = [...array];
  result.splice(index, 0, item);
  return result;
};

/**
 * Remove item at index
 */
export const removeAt = <T>(array: T[], index: number): T[] => {
  const result = [...array];
  result.splice(index, 1);
  return result;
};

/**
 * Toggle item in array (add if not present, remove if present)
 */
export const toggle = <T>(array: T[], item: T): T[] => {
  const index = array.indexOf(item);
  if (index === -1) {
    return [...array, item];
  }
  return removeAt(array, index);
};
