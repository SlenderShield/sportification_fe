/**
 * Object utility functions for common object operations
 */

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
};

/**
 * Deep merge two or more objects
 */
export const deepMerge = <T extends object>(...objects: Partial<T>[]): T => {
  const isObject = (obj: any): obj is object => obj && typeof obj === 'object' && !Array.isArray(obj);
  
  return objects.reduce((result, obj) => {
    Object.keys(obj).forEach(key => {
      const value = (obj as any)[key];
      
      if (isObject(value) && isObject((result as any)[key])) {
        (result as any)[key] = deepMerge((result as any)[key], value);
      } else {
        (result as any)[key] = value;
      }
    });
    
    return result;
  }, {} as T);
};

/**
 * Pick specific keys from an object
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Omit specific keys from an object
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: object): boolean => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Get nested value from object using path (e.g., 'user.profile.name')
 */
export const getNestedValue = <T = any>(obj: any, path: string, defaultValue?: T): T | undefined => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
};

/**
 * Set nested value in object using path (e.g., 'user.profile.name')
 */
export const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  let current = obj;
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
};

/**
 * Compare two objects for deep equality
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
};

/**
 * Map object values with a function
 */
export const mapValues = <T extends object, R>(obj: T, fn: (value: T[keyof T], key: keyof T) => R): Record<keyof T, R> => {
  const result = {} as Record<keyof T, R>;
  
  (Object.keys(obj) as Array<keyof T>).forEach(key => {
    result[key] = fn(obj[key], key);
  });
  
  return result;
};

/**
 * Map object keys with a function
 */
export const mapKeys = <T extends object>(obj: T, fn: (key: keyof T, value: T[keyof T]) => string): Record<string, T[keyof T]> => {
  const result: Record<string, T[keyof T]> = {};
  
  (Object.keys(obj) as Array<keyof T>).forEach(key => {
    const newKey = fn(key, obj[key]);
    result[newKey] = obj[key];
  });
  
  return result;
};

/**
 * Filter object by predicate
 */
export const filterObject = <T extends object>(obj: T, predicate: (value: T[keyof T], key: keyof T) => boolean): Partial<T> => {
  const result = {} as Partial<T>;
  
  (Object.keys(obj) as Array<keyof T>).forEach(key => {
    if (predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  });
  
  return result;
};

/**
 * Invert object (swap keys and values)
 */
export const invert = <T extends Record<string, string | number>>(obj: T): Record<string, string> => {
  const result: Record<string, string> = {};
  
  Object.keys(obj).forEach(key => {
    result[String(obj[key])] = key;
  });
  
  return result;
};

/**
 * Flatten nested object to dot notation
 */
export const flatten = (obj: any, prefix: string = ''): Record<string, any> => {
  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, newKey));
    } else {
      result[newKey] = value;
    }
  });
  
  return result;
};

/**
 * Unflatten object from dot notation
 */
export const unflatten = (obj: Record<string, any>): any => {
  const result: any = {};
  
  Object.keys(obj).forEach(key => {
    setNestedValue(result, key, obj[key]);
  });
  
  return result;
};

/**
 * Remove null and undefined values from object
 */
export const compact = <T extends object>(obj: T): Partial<T> => {
  return filterObject(obj, value => value !== null && value !== undefined);
};

/**
 * Remove falsy values from object
 */
export const compactFalsy = <T extends object>(obj: T): Partial<T> => {
  return filterObject(obj, value => Boolean(value));
};

/**
 * Get all keys from nested object
 */
export const getAllKeys = (obj: any, prefix: string = ''): string[] => {
  const keys: string[] = [];
  
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    keys.push(newKey);
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, newKey));
    }
  });
  
  return keys;
};

/**
 * Check if object has nested key
 */
export const hasNestedKey = (obj: any, path: string): boolean => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
};

/**
 * Rename object keys
 */
export const renameKeys = <T extends object>(obj: T, keyMap: Partial<Record<keyof T, string>>): any => {
  const result: any = {};
  
  (Object.keys(obj) as Array<keyof T>).forEach(key => {
    const newKey = keyMap[key] || key;
    result[newKey] = obj[key];
  });
  
  return result;
};

/**
 * Transform object keys to camelCase
 */
export const keysToCamelCase = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => keysToCamelCase(item));
  }
  
  const result: any = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = keysToCamelCase(obj[key]);
  });
  
  return result;
};

/**
 * Transform object keys to snake_case
 */
export const keysToSnakeCase = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => keysToSnakeCase(item));
  }
  
  const result: any = {};
  
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = keysToSnakeCase(obj[key]);
  });
  
  return result;
};
