/**
 * Navigation helper functions for type-safe navigation
 */

export type NavigationParams = Record<string, any>;

/**
 * Navigate to a screen with type-safe params
 */
export const navigateTo = <T extends NavigationParams>(
  navigation: any,
  screen: string,
  params?: T
): void => {
  navigation.navigate(screen, params);
};

/**
 * Replace current screen with a new one
 */
export const replaceWith = <T extends NavigationParams>(
  navigation: any,
  screen: string,
  params?: T
): void => {
  navigation.replace(screen, params);
};

/**
 * Go back to previous screen
 */
export const goBack = (navigation: any): void => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  }
};

/**
 * Pop to top of the stack
 */
export const popToTop = (navigation: any): void => {
  navigation.popToTop();
};

/**
 * Reset navigation state
 */
export const resetNavigation = (
  navigation: any,
  screens: Array<{ name: string; params?: NavigationParams }>
): void => {
  navigation.reset({
    index: screens.length - 1,
    routes: screens,
  });
};

/**
 * Navigate to tab
 */
export const navigateToTab = (
  navigation: any,
  tab: string,
  screen?: string,
  params?: NavigationParams
): void => {
  if (screen) {
    navigation.navigate(tab, { screen, params });
  } else {
    navigation.navigate(tab);
  }
};

/**
 * Push a new screen on the stack
 */
export const pushScreen = <T extends NavigationParams>(
  navigation: any,
  screen: string,
  params?: T
): void => {
  navigation.push(screen, params);
};

/**
 * Pop n screens from the stack
 */
export const popScreens = (navigation: any, count: number = 1): void => {
  navigation.pop(count);
};

/**
 * Check if can go back
 */
export const canGoBack = (navigation: any): boolean => {
  return navigation.canGoBack();
};

/**
 * Get current route name
 */
export const getCurrentRouteName = (navigation: any): string | undefined => {
  return navigation.getCurrentRoute()?.name;
};

/**
 * Get current route params
 */
export const getCurrentRouteParams = <T extends NavigationParams>(
  navigation: any
): T | undefined => {
  return navigation.getCurrentRoute()?.params as T | undefined;
};

/**
 * Navigate with conditional logic
 */
export const navigateIf = <T extends NavigationParams>(
  navigation: any,
  condition: boolean,
  screen: string,
  params?: T,
  fallbackScreen?: string,
  fallbackParams?: NavigationParams
): void => {
  if (condition) {
    navigation.navigate(screen, params);
  } else if (fallbackScreen) {
    navigation.navigate(fallbackScreen, fallbackParams);
  }
};

/**
 * Navigate after authentication
 */
export const navigateAfterAuth = (
  navigation: any,
  isAuthenticated: boolean,
  authenticatedScreen: string,
  unauthenticatedScreen: string = 'Login',
  params?: NavigationParams
): void => {
  const screen = isAuthenticated ? authenticatedScreen : unauthenticatedScreen;
  navigation.navigate(screen, params);
};

/**
 * Navigate based on user role
 */
export const navigateByRole = (
  navigation: any,
  role: string,
  roleScreenMap: Record<string, string>,
  defaultScreen: string,
  params?: NavigationParams
): void => {
  const screen = roleScreenMap[role] || defaultScreen;
  navigation.navigate(screen, params);
};

/**
 * Navigate to detail screen
 */
export const navigateToDetail = (
  navigation: any,
  detailScreen: string,
  itemId: string,
  additionalParams?: NavigationParams
): void => {
  navigation.navigate(detailScreen, { 
    id: itemId,
    ...additionalParams 
  });
};

/**
 * Navigate to edit screen
 */
export const navigateToEdit = (
  navigation: any,
  editScreen: string,
  item: any,
  additionalParams?: NavigationParams
): void => {
  navigation.navigate(editScreen, { 
    item,
    ...additionalParams 
  });
};

/**
 * Navigate to create screen
 */
export const navigateToCreate = (
  navigation: any,
  createScreen: string,
  initialData?: any
): void => {
  navigation.navigate(createScreen, { initialData });
};

/**
 * Navigate with callback
 */
export const navigateWithCallback = <T extends NavigationParams>(
  navigation: any,
  screen: string,
  callback: () => void,
  params?: T
): void => {
  navigation.navigate(screen, {
    ...params,
    onGoBack: callback,
  });
};

/**
 * Execute callback from navigation params
 */
export const executeCallback = (route: any, fallback?: () => void): void => {
  const callback = route.params?.onGoBack;
  if (callback && typeof callback === 'function') {
    callback();
  } else if (fallback) {
    fallback();
  }
};

/**
 * Navigate to nested screen
 */
export const navigateToNestedScreen = (
  navigation: any,
  navigator: string,
  screen: string,
  params?: NavigationParams
): void => {
  navigation.navigate(navigator, {
    screen,
    params,
  });
};

/**
 * Set navigation options
 */
export const setScreenOptions = (
  navigation: any,
  options: Record<string, any>
): void => {
  navigation.setOptions(options);
};

/**
 * Update screen title
 */
export const setScreenTitle = (navigation: any, title: string): void => {
  navigation.setOptions({ title });
};

/**
 * Show/hide header
 */
export const setHeaderShown = (navigation: any, shown: boolean): void => {
  navigation.setOptions({ headerShown: shown });
};

/**
 * Navigate and clear history
 */
export const navigateAndClearHistory = (
  navigation: any,
  screen: string,
  params?: NavigationParams
): void => {
  navigation.reset({
    index: 0,
    routes: [{ name: screen, params }],
  });
};

/**
 * Navigate to previous screen with data
 */
export const goBackWithData = <T>(
  navigation: any,
  data: T
): void => {
  navigation.navigate({
    name: navigation.getState().routes[navigation.getState().index - 1]?.name,
    params: { result: data },
    merge: true,
  });
};
