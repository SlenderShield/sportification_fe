// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve()),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve()),
}));

// Suppress console errors during tests (but keep them for debugging)
const originalError = console.error;
const originalWarn = console.warn;

global.console = {
  ...console,
  error: jest.fn((...args) => {
    // Suppress known warnings
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('Warning:') ||
       message.includes('ReactNative.NativeModules'))
    ) {
      return;
    }
    originalError(...args);
  }),
  warn: jest.fn((...args) => {
    // Suppress known warnings
    const message = args[0];
    if (
      typeof message === 'string' &&
      message.includes('Warning:')
    ) {
      return;
    }
    originalWarn(...args);
  }),
};
