import {
  deepClone,
  deepMerge,
  pick,
  omit,
  getNestedValue,
  setNestedValue,
  flattenObject,
  unflattenObject,
  isEqual,
  isEmpty,
  compact,
  mapKeys,
  mapValues,
  invert,
  defaults,
  removeEmpty,
  diff,
  keysToCamelCase,
  keysToSnakeCase,
} from '@shared/utils/objectUtils';

describe('objectUtils', () => {
  describe('deepClone', () => {
    it('should clone objects deeply', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone arrays deeply', () => {
      const arr = [1, [2, 3]];
      const cloned = deepClone(arr);
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
    });

    it('should handle null and undefined', () => {
      expect(deepClone(null)).toBeNull();
      expect(deepClone(undefined)).toBeUndefined();
    });
  });

  describe('deepMerge', () => {
    it('should merge objects deeply', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { b: { d: 3 }, e: 4 };
      const result = deepMerge(obj1, obj2);
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it('should merge multiple objects', () => {
      const result = deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should handle empty objects', () => {
      expect(deepMerge({}, { a: 1 })).toEqual({ a: 1 });
      expect(deepMerge({ a: 1 }, {})).toEqual({ a: 1 });
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1 };
      expect(pick(obj, ['a', 'b'])).toEqual({ a: 1 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('should handle non-existent keys', () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, ['c'])).toEqual({ a: 1, b: 2 });
    });
  });

  describe('getNestedValue', () => {
    it('should get nested values with dot notation', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(getNestedValue(obj, 'a.b.c')).toBe(1);
    });

    it('should return default value for missing paths', () => {
      const obj = { a: 1 };
      expect(getNestedValue(obj, 'b.c', 'default')).toBe('default');
    });

    it('should handle arrays in path', () => {
      const obj = { a: [{ b: 1 }] };
      expect(getNestedValue(obj, 'a.0.b')).toBe(1);
    });
  });

  describe('setNestedValue', () => {
    it('should set nested values', () => {
      const obj = { a: { b: 1 } };
      setNestedValue(obj, 'a.b', 2);
      expect(obj.a.b).toBe(2);
    });

    it('should create missing paths', () => {
      const obj: any = {};
      setNestedValue(obj, 'a.b.c', 1);
      expect(obj.a.b.c).toBe(1);
    });
  });

  describe('flattenObject', () => {
    it('should flatten nested objects', () => {
      const obj = { a: { b: { c: 1 } } };
      expect(flattenObject(obj)).toEqual({ 'a.b.c': 1 });
    });

    it('should handle arrays', () => {
      const obj = { a: [1, 2] };
      expect(flattenObject(obj)).toEqual({ 'a.0': 1, 'a.1': 2 });
    });
  });

  describe('unflattenObject', () => {
    it('should unflatten objects', () => {
      const obj = { 'a.b.c': 1 };
      expect(unflattenObject(obj)).toEqual({ a: { b: { c: 1 } } });
    });

    it('should handle array indices', () => {
      const obj = { 'a.0': 1, 'a.1': 2 };
      expect(unflattenObject(obj)).toEqual({ a: [1, 2] });
    });
  });

  describe('isEqual', () => {
    it('should compare objects deeply', () => {
      const obj1 = { a: 1, b: { c: 2 } };
      const obj2 = { a: 1, b: { c: 2 } };
      expect(isEqual(obj1, obj2)).toBe(true);
    });

    it('should detect differences', () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 2 };
      expect(isEqual(obj1, obj2)).toBe(false);
    });

    it('should compare primitives', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('a', 'a')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('should detect empty objects', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should handle arrays', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1])).toBe(false);
    });

    it('should handle null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });
  });

  describe('compact', () => {
    it('should remove falsy values', () => {
      const obj = { a: 1, b: null, c: undefined, d: '', e: 0, f: false };
      expect(compact(obj)).toEqual({ a: 1 });
    });
  });

  describe('mapKeys', () => {
    it('should map keys', () => {
      const obj = { a: 1, b: 2 };
      const result = mapKeys(obj, (key) => key.toUpperCase());
      expect(result).toEqual({ A: 1, B: 2 });
    });
  });

  describe('mapValues', () => {
    it('should map values', () => {
      const obj = { a: 1, b: 2 };
      const result = mapValues(obj, (val) => val * 2);
      expect(result).toEqual({ a: 2, b: 4 });
    });
  });

  describe('invert', () => {
    it('should invert key-value pairs', () => {
      const obj = { a: '1', b: '2' };
      expect(invert(obj)).toEqual({ '1': 'a', '2': 'b' });
    });
  });

  describe('defaults', () => {
    it('should apply default values', () => {
      const obj = { a: 1 };
      const result = defaults(obj, { a: 2, b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('removeEmpty', () => {
    it('should remove empty strings and null', () => {
      const obj = { a: 1, b: '', c: null, d: undefined };
      expect(removeEmpty(obj)).toEqual({ a: 1 });
    });
  });

  describe('diff', () => {
    it('should find differences between objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3, c: 4 };
      const result = diff(obj1, obj2);
      expect(result).toEqual({ b: 3, c: 4 });
    });
  });

  describe('keysToCamelCase', () => {
    it('should convert keys to camelCase', () => {
      const obj = { first_name: 'John', last_name: 'Doe' };
      expect(keysToCamelCase(obj)).toEqual({ firstName: 'John', lastName: 'Doe' });
    });
  });

  describe('keysToSnakeCase', () => {
    it('should convert keys to snake_case', () => {
      const obj = { firstName: 'John', lastName: 'Doe' };
      expect(keysToSnakeCase(obj)).toEqual({ first_name: 'John', last_name: 'Doe' });
    });
  });
});
