import React, { createContext, useContext, ReactNode } from 'react';
import { Container, container as globalContainer } from './Container';

/**
 * Context for dependency injection container
 */
const ContainerContext = createContext<Container | null>(null);

/**
 * Provider props
 */
interface ContainerProviderProps {
  children: ReactNode;
  container?: Container;
}

/**
 * Provider component for dependency injection container
 * 
 * Wrap your app with this provider to make the DI container
 * available throughout the component tree.
 * 
 * @example
 * ```typescript
 * <ContainerProvider>
 *   <App />
 * </ContainerProvider>
 * ```
 */
export const ContainerProvider: React.FC<ContainerProviderProps> = ({
  children,
  container = globalContainer,
}) => {
  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
};

/**
 * Hook to access the DI container
 * 
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const container = useContainer();
 *   const apiService = container.resolve<ApiService>('api');
 *   // ...
 * }
 * ```
 */
export const useContainer = (): Container => {
  const container = useContext(ContainerContext);
  
  if (!container) {
    throw new Error('useContainer must be used within a ContainerProvider');
  }
  
  return container;
};

/**
 * Hook to resolve a service from the container
 * 
 * @param key Service identifier
 * @returns The resolved service
 * 
 * @example
 * ```typescript
 * const MyComponent = () => {
 *   const apiService = useService<ApiService>('api');
 *   // ...
 * }
 * ```
 */
export const useService = <T,>(key: string): T => {
  const container = useContainer();
  return container.resolve<T>(key);
};
