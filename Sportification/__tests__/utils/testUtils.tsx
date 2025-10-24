import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';

/**
 * Create a mock Redux store for testing
 */
export const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      auth: (state = initialState.auth || {}) => state,
      matches: (state = initialState.matches || {}) => state,
      teams: (state = initialState.teams || {}) => state,
      tournaments: (state = initialState.tournaments || {}) => state,
      venues: (state = initialState.venues || {}) => state,
    },
    preloadedState: initialState,
  });
};

/**
 * Render component with Redux provider
 */
export const renderWithRedux = (
  component: ReactElement,
  {
    initialState = {},
    store = createMockStore(initialState),
    ...renderOptions
  }: any = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
};

/**
 * Render component with Navigation container
 */
export const renderWithNavigation = (
  component: ReactElement,
  renderOptions?: RenderOptions
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <NavigationContainer>{children}</NavigationContainer>
  );

  return render(component, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Render component with both Redux and Navigation
 */
export const renderWithProviders = (
  component: ReactElement,
  {
    initialState = {},
    store = createMockStore(initialState),
    ...renderOptions
  }: any = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <NavigationContainer>{children}</NavigationContainer>
    </Provider>
  );

  return {
    ...render(component, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
};

/**
 * Wait for a condition to be true
 */
export const waitForCondition = (
  condition: () => boolean,
  timeout: number = 5000
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error('Timeout waiting for condition'));
      }
    }, 100);
  });
};

/**
 * Create a mock navigation object
 */
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  canGoBack: jest.fn(() => true),
  getCurrentRoute: jest.fn(() => ({ name: 'Test', params: {} })),
  getState: jest.fn(() => ({ routes: [], index: 0 })),
});

/**
 * Create a mock route object
 */
export const createMockRoute = (params: any = {}) => ({
  key: 'test-route-key',
  name: 'TestScreen',
  params,
});

/**
 * Flush all promises
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

/**
 * Mock a successful API response
 */
export const mockApiSuccess = <T,>(data: T) => {
  return Promise.resolve({
    data: {
      success: true,
      data,
      message: 'Success',
    },
  });
};

/**
 * Mock an API error response
 */
export const mockApiError = (message: string, status: number = 400) => {
  return Promise.reject({
    response: {
      status,
      data: {
        success: false,
        message,
      },
    },
  });
};
