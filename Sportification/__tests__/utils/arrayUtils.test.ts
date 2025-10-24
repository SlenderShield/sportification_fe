import {
  unique,
  uniqueBy,
  groupBy,
  chunk,
  shuffle,
  sortBy,
  findBy,
  partition,
  take,
  takeLast,
  flatten,
  range,
  sum,
  average,
  min,
  max,
  intersection,
  difference,
  union,
  compact,
  toggle,
} from '@shared/utils/arrayUtils';

describe('arrayUtils', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('uniqueBy', () => {
    it('should remove duplicates by key', () => {
      const items = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 1, name: 'C' },
      ];
      const result = uniqueBy(items, 'id');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  describe('groupBy', () => {
    it('should group items by key', () => {
      const items = [
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
        { type: 'A', value: 3 },
      ];
      const result = groupBy(items, 'type');
      expect(result.A).toHaveLength(2);
      expect(result.B).toHaveLength(1);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      const result = chunk([1, 2, 3, 4, 5], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      expect(result).toHaveLength(5);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should not modify original array', () => {
      const arr = [1, 2, 3];
      shuffle(arr);
      expect(arr).toEqual([1, 2, 3]);
    });
  });

  describe('sortBy', () => {
    it('should sort by key ascending', () => {
      const items = [
        { age: 30 },
        { age: 20 },
        { age: 25 },
      ];
      const result = sortBy(items, 'age');
      expect(result[0].age).toBe(20);
      expect(result[2].age).toBe(30);
    });

    it('should sort by key descending', () => {
      const items = [
        { age: 20 },
        { age: 30 },
        { age: 25 },
      ];
      const result = sortBy(items, 'age', 'desc');
      expect(result[0].age).toBe(30);
      expect(result[2].age).toBe(20);
    });
  });

  describe('findBy', () => {
    it('should find item by key-value', () => {
      const items = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ];
      const result = findBy(items, 'id', 2);
      expect(result).toEqual({ id: 2, name: 'B' });
    });
  });

  describe('partition', () => {
    it('should partition array by predicate', () => {
      const [evens, odds] = partition([1, 2, 3, 4, 5], n => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
      expect(odds).toEqual([1, 3, 5]);
    });
  });

  describe('take', () => {
    it('should take first n items', () => {
      expect(take([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
    });
  });

  describe('takeLast', () => {
    it('should take last n items', () => {
      expect(takeLast([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(flatten([1, [2, 3], [4, [5, 6]]])).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('range', () => {
    it('should create range of numbers', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
      expect(range(1, 4)).toEqual([1, 2, 3]);
    });

    it('should support step', () => {
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    });
  });

  describe('sum', () => {
    it('should calculate sum', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
      expect(sum([10, 20, 30])).toBe(60);
    });
  });

  describe('average', () => {
    it('should calculate average', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([10, 20, 30])).toBe(20);
    });

    it('should return 0 for empty array', () => {
      expect(average([])).toBe(0);
    });
  });

  describe('min', () => {
    it('should find minimum value', () => {
      expect(min([3, 1, 4, 1, 5])).toBe(1);
    });
  });

  describe('max', () => {
    it('should find maximum value', () => {
      expect(max([3, 1, 4, 1, 5])).toBe(5);
    });
  });

  describe('intersection', () => {
    it('should find intersection of arrays', () => {
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });
  });

  describe('difference', () => {
    it('should find difference of arrays', () => {
      expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
    });
  });

  describe('union', () => {
    it('should find union of arrays', () => {
      const result = union([1, 2, 3], [3, 4, 5]);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('compact', () => {
    it('should remove falsy values', () => {
      expect(compact([1, 0, '', false, null, undefined, 2])).toEqual([1, 2]);
    });
  });

  describe('toggle', () => {
    it('should add item if not present', () => {
      expect(toggle([1, 2, 3], 4)).toEqual([1, 2, 3, 4]);
    });

    it('should remove item if present', () => {
      expect(toggle([1, 2, 3], 2)).toEqual([1, 3]);
    });
  });
});
