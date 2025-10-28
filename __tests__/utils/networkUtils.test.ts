import NetInfo from '@react-native-community/netinfo';
import {
  isOnline,
  waitForConnection,
  retryWithBackoff,
  parseUrl,
  buildUrl,
  getQueryParams,
  addQueryParams,
  removeQueryParams,
  isValidUrl,
  getNetworkSpeed,
  estimateNetworkQuality,
} from '@shared/utils/networkUtils';

// Mock NetInfo
jest.mock('@react-native-community/netinfo');

describe('networkUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isOnline', () => {
    it('should return true when connected', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({ isConnected: true });
      const result = await isOnline();
      expect(result).toBe(true);
    });

    it('should return false when disconnected', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValueOnce({ isConnected: false });
      const result = await isOnline();
      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      (NetInfo.fetch as jest.Mock).mockRejectedValueOnce(new Error('Error'));
      const result = await isOnline();
      expect(result).toBe(false);
    });
  });

  describe('parseUrl', () => {
    it('should parse URL correctly', () => {
      const result = parseUrl('https://example.com:8080/path?query=value#hash');
      expect(result.protocol).toBe('https:');
      expect(result.hostname).toBe('example.com');
      expect(result.port).toBe('8080');
      expect(result.pathname).toBe('/path');
      expect(result.search).toBe('?query=value');
      expect(result.hash).toBe('#hash');
    });

    it('should handle URL without port', () => {
      const result = parseUrl('https://example.com/path');
      expect(result.hostname).toBe('example.com');
      expect(result.port).toBe('');
    });
  });

  describe('buildUrl', () => {
    it('should build URL from components', () => {
      const result = buildUrl({
        protocol: 'https:',
        hostname: 'example.com',
        pathname: '/path',
        search: '?query=value',
      });
      expect(result).toContain('example.com');
      expect(result).toContain('/path');
    });

    it('should handle URL without search', () => {
      const result = buildUrl({
        protocol: 'https:',
        hostname: 'example.com',
        pathname: '/path',
      });
      expect(result).toBe('https://example.com/path');
    });
  });

  describe('getQueryParams', () => {
    it('should parse query parameters', () => {
      const result = getQueryParams('?key1=value1&key2=value2');
      expect(result).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should handle empty query string', () => {
      const result = getQueryParams('');
      expect(result).toEqual({});
    });

    it('should decode URI components', () => {
      const result = getQueryParams('?key=hello%20world');
      expect(result.key).toBe('hello world');
    });
  });

  describe('addQueryParams', () => {
    it('should add query parameters to URL', () => {
      const result = addQueryParams('https://example.com/path', { key: 'value' });
      expect(result).toContain('key=value');
    });

    it('should append to existing params', () => {
      const result = addQueryParams('https://example.com/path?existing=param', { new: 'param' });
      expect(result).toContain('existing=param');
      expect(result).toContain('new=param');
    });
  });

  describe('removeQueryParams', () => {
    it('should remove specified query parameters', () => {
      const result = removeQueryParams('https://example.com/path?key1=val1&key2=val2', ['key1']);
      expect(result).not.toContain('key1');
      expect(result).toContain('key2');
    });

    it('should handle non-existent params', () => {
      const url = 'https://example.com/path?key=value';
      const result = removeQueryParams(url, ['nonexistent']);
      expect(result).toContain('key=value');
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false); // If not allowed
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');
      const result = await retryWithBackoff(fn, { maxAttempts: 3, initialDelay: 10 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max attempts', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'));
      await expect(retryWithBackoff(fn, { maxAttempts: 2, initialDelay: 10 })).rejects.toThrow();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('waitForConnection', () => {
    it('should resolve when online', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });
      await expect(waitForConnection(100)).resolves.not.toThrow();
    });

    it('should timeout if offline', async () => {
      (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });
      await expect(waitForConnection(100)).rejects.toThrow();
    });
  });

  describe('getNetworkSpeed', () => {
    it('should estimate network speed', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
      });
      const speed = await getNetworkSpeed();
      expect(speed).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 on error', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Error'));
      const speed = await getNetworkSpeed();
      expect(speed).toBe(0);
    });
  });

  describe('estimateNetworkQuality', () => {
    it('should estimate good quality', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024 * 1024)),
      });
      const quality = await estimateNetworkQuality();
      expect(['excellent', 'good', 'fair', 'poor']).toContain(quality);
    });
  });
});
