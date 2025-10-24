import { InteractionManager } from 'react-native';
import {
  runAfterInteractions,
  debounce,
  throttle,
  measurePerformance,
  memoize,
  shallowEqual,
  PerformanceMonitor,
  LazyValue,
  StableReference,
} from '@shared/utils/performanceUtils';

jest.mock('react-native', () => ({
  InteractionManager: {
    runAfterInteractions: jest.fn((callback) => {
      callback?.();
      return { cancel: jest.fn() };
    }),
  },
}));

describe('performanceUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('runAfterInteractions', () => {
    it('should run callback after interactions', async () => {
      const callback = jest.fn();
      await runAfterInteractions(callback);
      expect(InteractionManager.runAfterInteractions).toHaveBeenCalled();
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass latest arguments', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 100);

      debounced('first');
      debounced('second');
      debounced('third');

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledWith('third');
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('measurePerformance', () => {
    it('should measure function performance', () => {
      const fn = () => 'result';
      const result = measurePerformance('test', fn);
      expect(result).toBe('result');
    });

    it('should measure async function performance', async () => {
      const fn = async () => 'result';
      const result = await measurePerformance('test', fn);
      expect(result).toBe('result');
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const fn = jest.fn((x: number) => x * 2);
      const memoized = memoize(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should use custom cache key', () => {
      const fn = jest.fn((obj: any) => obj.value);
      const memoized = memoize(fn, (obj) => obj.id);

      const obj1 = { id: 1, value: 'a' };
      const obj2 = { id: 1, value: 'b' };

      expect(memoized(obj1)).toBe('a');
      expect(memoized(obj2)).toBe('a'); // Same cache key
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('shallowEqual', () => {
    it('should return true for equal primitives', () => {
      expect(shallowEqual(1, 1)).toBe(true);
      expect(shallowEqual('a', 'a')).toBe(true);
      expect(shallowEqual(true, true)).toBe(true);
    });

    it('should return false for different primitives', () => {
      expect(shallowEqual(1, 2)).toBe(false);
      expect(shallowEqual('a', 'b')).toBe(false);
    });

    it('should compare objects shallowly', () => {
      expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it('should detect different objects', () => {
      expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(shallowEqual({ a: 1 }, { b: 1 })).toBe(false);
    });

    it('should not compare nested objects deeply', () => {
      const obj1 = { a: { b: 1 } };
      const obj2 = { a: { b: 1 } };
      expect(shallowEqual(obj1, obj2)).toBe(false); // Different references
    });
  });

  describe('PerformanceMonitor', () => {
    it('should mark performance points', () => {
      const monitor = new PerformanceMonitor();
      monitor.mark('start');
      expect(() => monitor.mark('start')).not.toThrow();
    });

    it('should measure performance', () => {
      const monitor = new PerformanceMonitor();
      monitor.mark('start');
      monitor.mark('end');
      const duration = monitor.measure('test', 'start', 'end');
      expect(typeof duration).toBe('number');
    });

    it('should calculate average duration', () => {
      const monitor = new PerformanceMonitor();
      monitor.mark('start1');
      monitor.mark('end1');
      monitor.measure('test1', 'start1', 'end1');

      monitor.mark('start2');
      monitor.mark('end2');
      monitor.measure('test2', 'start2', 'end2');

      const avg = monitor.getAverageDuration('start1', 'end1');
      expect(typeof avg).toBe('number');
    });

    it('should clear marks', () => {
      const monitor = new PerformanceMonitor();
      monitor.mark('test');
      monitor.clear('test');
      expect(() => monitor.clear()).not.toThrow();
    });
  });

  describe('LazyValue', () => {
    it('should initialize value lazily', () => {
      const initializer = jest.fn(() => 'value');
      const lazy = new LazyValue(initializer);

      expect(initializer).not.toHaveBeenCalled();
      expect(lazy.get()).toBe('value');
      expect(initializer).toHaveBeenCalledTimes(1);
    });

    it('should cache initialized value', () => {
      const initializer = jest.fn(() => 'value');
      const lazy = new LazyValue(initializer);

      lazy.get();
      lazy.get();
      expect(initializer).toHaveBeenCalledTimes(1);
    });

    it('should allow reset', () => {
      const initializer = jest.fn(() => 'value');
      const lazy = new LazyValue(initializer);

      lazy.get();
      lazy.reset();
      lazy.get();
      expect(initializer).toHaveBeenCalledTimes(2);
    });
  });

  describe('StableReference', () => {
    it('should maintain stable reference', () => {
      const stable = new StableReference({ a: 1 });
      const ref1 = stable.get();
      const ref2 = stable.get();
      expect(ref1).toBe(ref2);
    });

    it('should update value', () => {
      const stable = new StableReference({ a: 1 });
      stable.update({ a: 2 });
      expect(stable.get()).toEqual({ a: 2 });
    });
  });
});
