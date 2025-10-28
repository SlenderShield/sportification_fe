/**
 * Navigation service interface for type-safe navigation
 */
export interface INavigationService {
  /**
   * Navigate to a screen
   * @param screen Screen name
   * @param params Optional navigation parameters
   */
  navigate(screen: string, params?: Record<string, any>): void;

  /**
   * Go back to the previous screen
   */
  goBack(): void;

  /**
   * Reset the navigation state
   * @param routes Array of route objects to reset to
   */
  reset(routes: Array<{ name: string; params?: Record<string, any> }>): void;

  /**
   * Replace the current screen
   * @param screen Screen name
   * @param params Optional navigation parameters
   */
  replace(screen: string, params?: Record<string, any>): void;

  /**
   * Navigate to the root of a navigator
   * @param navigator Navigator name
   */
  popToTop(): void;

  /**
   * Check if we can go back
   * @returns True if there's a screen to go back to
   */
  canGoBack(): boolean;
}

/**
 * Extended navigation service with nested navigator support
 */
export interface INestedNavigationService extends INavigationService {
  /**
   * Navigate within a specific navigator
   * @param navigator Navigator name
   * @param screen Screen name
   * @param params Optional navigation parameters
   */
  navigateInNavigator(
    navigator: string,
    screen: string,
    params?: Record<string, any>
  ): void;
}
