import { NavigationProp, RouteProp } from '@react-navigation/native';
import {
  navigate,
  replace,
  goBack,
  canGoBack,
  reset,
  push,
  pop,
  popToTop,
  navigateWithParams,
  navigateIf,
  navigateIfNot,
  navigateWithRole,
  navigateWithAuth,
  navigateToScreen,
  navigateToTab,
  navigateBack,
  getRouteParams,
  getCurrentRoute,
  getPreviousRoute,
  setParams,
} from '@shared/helpers/navigationHelpers';

// Mock navigation object
const createMockNavigation = (): NavigationProp<any> =>
  ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
    reset: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    setParams: jest.fn(),
    getState: jest.fn(() => ({
      routes: [
        { name: 'Home', params: {} },
        { name: 'Profile', params: { id: '123' } },
      ],
      index: 1,
    })),
  } as any);

describe('navigationHelpers', () => {
  let mockNavigation: NavigationProp<any>;

  beforeEach(() => {
    mockNavigation = createMockNavigation();
  });

  describe('navigate', () => {
    it('should navigate to screen', () => {
      navigate(mockNavigation, 'Home');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home', undefined);
    });

    it('should navigate with params', () => {
      navigate(mockNavigation, 'Profile', { id: '123' });
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile', { id: '123' });
    });
  });

  describe('replace', () => {
    it('should replace current screen', () => {
      replace(mockNavigation, 'Home');
      expect(mockNavigation.replace).toHaveBeenCalledWith('Home', undefined);
    });
  });

  describe('goBack', () => {
    it('should go back', () => {
      goBack(mockNavigation);
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('canGoBack', () => {
    it('should check if can go back', () => {
      const result = canGoBack(mockNavigation);
      expect(result).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset navigation state', () => {
      reset(mockNavigation, 'Home');
      expect(mockNavigation.reset).toHaveBeenCalled();
    });
  });

  describe('push', () => {
    it('should push new screen', () => {
      push(mockNavigation, 'Details');
      expect(mockNavigation.push).toHaveBeenCalledWith('Details', undefined);
    });
  });

  describe('pop', () => {
    it('should pop screen', () => {
      pop(mockNavigation);
      expect(mockNavigation.pop).toHaveBeenCalled();
    });
  });

  describe('popToTop', () => {
    it('should pop to top', () => {
      popToTop(mockNavigation);
      expect(mockNavigation.popToTop).toHaveBeenCalled();
    });
  });

  describe('navigateWithParams', () => {
    it('should navigate with params object', () => {
      navigateWithParams(mockNavigation, 'Profile', { id: '123', tab: 'posts' });
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile', { id: '123', tab: 'posts' });
    });
  });

  describe('navigateIf', () => {
    it('should navigate if condition is true', () => {
      navigateIf(mockNavigation, true, 'Home');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home', undefined);
    });

    it('should not navigate if condition is false', () => {
      navigateIf(mockNavigation, false, 'Home');
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  describe('navigateIfNot', () => {
    it('should navigate if condition is false', () => {
      navigateIfNot(mockNavigation, false, 'Home');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home', undefined);
    });

    it('should not navigate if condition is true', () => {
      navigateIfNot(mockNavigation, true, 'Home');
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  describe('navigateWithRole', () => {
    it('should navigate if user has required role', () => {
      navigateWithRole(mockNavigation, 'admin', 'AdminPanel', ['admin']);
      expect(mockNavigation.navigate).toHaveBeenCalled();
    });

    it('should not navigate if user lacks required role', () => {
      navigateWithRole(mockNavigation, 'user', 'AdminPanel', ['admin']);
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  describe('navigateWithAuth', () => {
    it('should navigate if authenticated', () => {
      navigateWithAuth(mockNavigation, true, 'Profile');
      expect(mockNavigation.navigate).toHaveBeenCalled();
    });

    it('should navigate to login if not authenticated', () => {
      navigateWithAuth(mockNavigation, false, 'Profile');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login', expect.any(Object));
    });
  });

  describe('navigateToScreen', () => {
    it('should navigate to screen in stack', () => {
      navigateToScreen(mockNavigation, 'Main', 'Home');
      expect(mockNavigation.navigate).toHaveBeenCalled();
    });
  });

  describe('navigateToTab', () => {
    it('should navigate to tab', () => {
      navigateToTab(mockNavigation, 'Home');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  describe('navigateBack', () => {
    it('should navigate back or to fallback', () => {
      navigateBack(mockNavigation, 'Home');
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('getRouteParams', () => {
    it('should get route params', () => {
      const route: RouteProp<any> = {
        key: 'test',
        name: 'Profile',
        params: { id: '123' },
      };
      const params = getRouteParams(route);
      expect(params).toEqual({ id: '123' });
    });
  });

  describe('getCurrentRoute', () => {
    it('should get current route', () => {
      const route = getCurrentRoute(mockNavigation);
      expect(route?.name).toBe('Profile');
    });
  });

  describe('getPreviousRoute', () => {
    it('should get previous route', () => {
      const route = getPreviousRoute(mockNavigation);
      expect(route?.name).toBe('Home');
    });
  });

  describe('setParams', () => {
    it('should set params', () => {
      setParams(mockNavigation, { key: 'value' });
      expect(mockNavigation.setParams).toHaveBeenCalledWith({ key: 'value' });
    });
  });
});
