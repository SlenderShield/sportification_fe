/**
 * Base interface for all services in the application.
 * Services that implement this interface can be properly initialized and cleaned up.
 */
export interface IService {
  /**
   * Initialize the service. Called when the service is first created.
   * @returns Promise that resolves when initialization is complete
   */
  initialize(): Promise<void>;

  /**
   * Clean up resources used by the service. Called when the service is destroyed.
   */
  cleanup(): void;
}

/**
 * Base interface for service with lifecycle hooks
 */
export interface IServiceWithLifecycle extends IService {
  /**
   * Called when the app comes to the foreground
   */
  onAppForeground?(): void;

  /**
   * Called when the app goes to the background
   */
  onAppBackground?(): void;
}
