import { IService } from '../types/IService';

/**
 * Service factory function type
 */
type ServiceFactory<T> = () => T;

/**
 * Service lifecycle type
 */
type ServiceLifecycle = 'singleton' | 'transient';

/**
 * Service registration
 */
interface ServiceRegistration<T> {
  factory: ServiceFactory<T>;
  lifecycle: ServiceLifecycle;
  instance?: T;
}

/**
 * Dependency Injection Container
 * 
 * Simple IoC container for managing service dependencies.
 * Supports singleton and transient lifecycles.
 * 
 * @example
 * ```typescript
 * // Register a singleton service
 * container.registerSingleton('api', () => new ApiService());
 * 
 * // Register a transient service
 * container.registerTransient('logger', () => new ConsoleLogger());
 * 
 * // Resolve a service
 * const api = container.resolve<ApiService>('api');
 * ```
 */
export class Container {
  private services = new Map<string, ServiceRegistration<any>>();
  private initializedServices = new Set<string>();

  /**
   * Register a singleton service (one instance for the lifetime of the app)
   * @param key Service identifier
   * @param factory Factory function to create the service
   */
  registerSingleton<T>(key: string, factory: ServiceFactory<T>): void {
    if (this.services.has(key)) {
      console.warn(`Service ${key} is already registered. Overwriting.`);
    }

    this.services.set(key, {
      factory,
      lifecycle: 'singleton',
    });
  }

  /**
   * Register a transient service (new instance each time)
   * @param key Service identifier
   * @param factory Factory function to create the service
   */
  registerTransient<T>(key: string, factory: ServiceFactory<T>): void {
    if (this.services.has(key)) {
      console.warn(`Service ${key} is already registered. Overwriting.`);
    }

    this.services.set(key, {
      factory,
      lifecycle: 'transient',
    });
  }

  /**
   * Resolve a service by its key
   * @param key Service identifier
   * @returns The service instance
   * @throws Error if service is not registered
   */
  resolve<T>(key: string): T {
    const registration = this.services.get(key);

    if (!registration) {
      throw new Error(
        `Service '${key}' not registered. Available services: ${Array.from(
          this.services.keys()
        ).join(', ')}`
      );
    }

    // For singleton, return existing instance or create new one
    if (registration.lifecycle === 'singleton') {
      if (!registration.instance) {
        registration.instance = registration.factory();
      }
      return registration.instance as T;
    }

    // For transient, always create new instance
    return registration.factory() as T;
  }

  /**
   * Check if a service is registered
   * @param key Service identifier
   * @returns True if service is registered
   */
  has(key: string): boolean {
    return this.services.has(key);
  }

  /**
   * Remove a service registration
   * @param key Service identifier
   */
  unregister(key: string): void {
    const registration = this.services.get(key);
    
    if (registration?.instance && this.isService(registration.instance)) {
      registration.instance.cleanup();
    }

    this.services.delete(key);
    this.initializedServices.delete(key);
  }

  /**
   * Initialize all registered services that implement IService
   * @returns Promise that resolves when all services are initialized
   */
  async initializeAll(): Promise<void> {
    const initPromises: Promise<void>[] = [];

    for (const [key, registration] of this.services.entries()) {
      if (registration.lifecycle === 'singleton' && !this.initializedServices.has(key)) {
        const service = this.resolve(key);
        
        if (this.isService(service)) {
          initPromises.push(
            service.initialize().then(() => {
              this.initializedServices.add(key);
            })
          );
        }
      }
    }

    await Promise.all(initPromises);
  }

  /**
   * Cleanup all registered services
   */
  cleanupAll(): void {
    for (const registration of this.services.values()) {
      if (registration.instance && this.isService(registration.instance)) {
        registration.instance.cleanup();
      }
    }

    this.initializedServices.clear();
  }

  /**
   * Clear all service registrations
   */
  clear(): void {
    this.cleanupAll();
    this.services.clear();
  }

  /**
   * Get all registered service keys
   * @returns Array of service keys
   */
  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Type guard to check if an object implements IService
   */
  private isService(obj: any): obj is IService {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.initialize === 'function' &&
      typeof obj.cleanup === 'function'
    );
  }
}

/**
 * Global container instance
 */
export const container = new Container();
