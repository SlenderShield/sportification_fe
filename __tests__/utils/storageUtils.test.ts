import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TypedStorage,
  saveData,
  getData,
  removeData,
  clearAll,
  getAllKeys,
  multiGet,
  multiSet,
  multiRemove,
  getStorageSize,
  saveWithExpiry,
  getWithExpiry,
} from '@shared/utils/storageUtils';

describe('storageUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveData', () => {
    it('should save data to AsyncStorage', async () => {
      await saveData('testKey', { value: 'test' });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify({ value: 'test' })
      );
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));
      await expect(saveData('testKey', 'value')).resolves.not.toThrow();
    });
  });

  describe('getData', () => {
    it('should retrieve data from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify({ value: 'test' }));
      const result = await getData('testKey');
      expect(result).toEqual({ value: 'test' });
    });

    it('should return null for non-existent keys', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await getData('nonExistent');
      expect(result).toBeNull();
    });

    it('should return default value when specified', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await getData('key', 'default');
      expect(result).toBe('default');
    });

    it('should handle JSON parse errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid json');
      const result = await getData('key');
      expect(result).toBeNull();
    });
  });

  describe('removeData', () => {
    it('should remove data from AsyncStorage', async () => {
      await removeData('testKey');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(new Error('Error'));
      await expect(removeData('key')).resolves.not.toThrow();
    });
  });

  describe('clearAll', () => {
    it('should clear all AsyncStorage data', async () => {
      await clearAll();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });

  describe('getAllKeys', () => {
    it('should get all keys from AsyncStorage', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce(['key1', 'key2']);
      const keys = await getAllKeys();
      expect(keys).toEqual(['key1', 'key2']);
    });

    it('should return empty array on error', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValueOnce(new Error('Error'));
      const keys = await getAllKeys();
      expect(keys).toEqual([]);
    });
  });

  describe('multiGet', () => {
    it('should get multiple values', async () => {
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValueOnce([
        ['key1', JSON.stringify('value1')],
        ['key2', JSON.stringify('value2')],
      ]);
      const result = await multiGet(['key1', 'key2']);
      expect(result).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should handle errors', async () => {
      (AsyncStorage.multiGet as jest.Mock).mockRejectedValueOnce(new Error('Error'));
      const result = await multiGet(['key1']);
      expect(result).toEqual({});
    });
  });

  describe('multiSet', () => {
    it('should set multiple values', async () => {
      const data = { key1: 'value1', key2: 'value2' };
      await multiSet(data);
      expect(AsyncStorage.multiSet).toHaveBeenCalled();
    });
  });

  describe('multiRemove', () => {
    it('should remove multiple keys', async () => {
      await multiRemove(['key1', 'key2']);
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['key1', 'key2']);
    });
  });

  describe('getStorageSize', () => {
    it('should calculate storage size', async () => {
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce(['key1', 'key2']);
      (AsyncStorage.multiGet as jest.Mock).mockResolvedValueOnce([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]);
      const size = await getStorageSize();
      expect(size).toBeGreaterThan(0);
    });
  });

  describe('saveWithExpiry', () => {
    it('should save data with expiration', async () => {
      await saveWithExpiry('key', 'value', 1000);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getWithExpiry', () => {
    it('should get non-expired data', async () => {
      const futureTime = Date.now() + 10000;
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ value: 'test', expiry: futureTime })
      );
      const result = await getWithExpiry('key');
      expect(result).toBe('test');
    });

    it('should return null for expired data', async () => {
      const pastTime = Date.now() - 1000;
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ value: 'test', expiry: pastTime })
      );
      const result = await getWithExpiry('key');
      expect(result).toBeNull();
    });

    it('should remove expired data', async () => {
      const pastTime = Date.now() - 1000;
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({ value: 'test', expiry: pastTime })
      );
      await getWithExpiry('key');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('key');
    });
  });

  describe('TypedStorage', () => {
    interface TestData {
      name: string;
      age: number;
    }

    const storage = new TypedStorage<TestData>('test');

    it('should save typed data', async () => {
      const data: TestData = { name: 'John', age: 30 };
      await storage.save(data);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should get typed data', async () => {
      const data: TestData = { name: 'John', age: 30 };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(data));
      const result = await storage.get();
      expect(result).toEqual(data);
    });

    it('should remove typed data', async () => {
      await storage.remove();
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });
  });
});
