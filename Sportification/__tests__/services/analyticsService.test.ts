import { analyticsService } from '../../src/services/analyticsService';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    logEvent: jest.fn(),
    logScreenView: jest.fn(),
    setUserId: jest.fn(),
    setUserProperty: jest.fn(),
    setAnalyticsCollectionEnabled: jest.fn(),
  })),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setUserId: jest.fn(),
    setAttribute: jest.fn(),
    log: jest.fn(),
    recordError: jest.fn(),
    setCrashlyticsCollectionEnabled: jest.fn(),
  })),
}));

describe('AnalyticsService', () => {
  let mockAnalytics: any;
  let mockCrashlytics: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalytics = analytics();
    mockCrashlytics = crashlytics();
  });

  describe('logEvent', () => {
    it('should log custom event without params', async () => {
      await analyticsService.logEvent('test_event');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('test_event', undefined);
    });

    it('should log custom event with params', async () => {
      const params = { item_id: '123', category: 'sports' };

      await analyticsService.logEvent('test_event', params);

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('test_event', params);
    });

    it('should handle logging errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAnalytics.logEvent.mockRejectedValue(new Error('Log error'));

      await analyticsService.logEvent('test_event');

      expect(consoleSpy).toHaveBeenCalledWith('Analytics log event error:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('logScreenView', () => {
    it('should log screen view', async () => {
      await analyticsService.logScreenView('HomeScreen');

      expect(mockAnalytics.logScreenView).toHaveBeenCalledWith({
        screen_name: 'HomeScreen',
        screen_class: 'HomeScreen',
      });
    });

    it('should log screen view with custom class', async () => {
      await analyticsService.logScreenView('HomeScreen', 'CustomHomeScreen');

      expect(mockAnalytics.logScreenView).toHaveBeenCalledWith({
        screen_name: 'HomeScreen',
        screen_class: 'CustomHomeScreen',
      });
    });
  });

  describe('setUserProperties', () => {
    it('should set user ID in both services', async () => {
      await analyticsService.setUserProperties({ userId: 'user123' });

      expect(mockAnalytics.setUserId).toHaveBeenCalledWith('user123');
      expect(mockCrashlytics.setUserId).toHaveBeenCalledWith('user123');
    });

    it('should set email in crashlytics', async () => {
      await analyticsService.setUserProperties({ email: 'test@example.com' });

      expect(mockCrashlytics.setAttribute).toHaveBeenCalledWith('email', 'test@example.com');
    });

    it('should set role in both services', async () => {
      await analyticsService.setUserProperties({ role: 'admin' });

      expect(mockAnalytics.setUserProperty).toHaveBeenCalledWith('role', 'admin');
      expect(mockCrashlytics.setAttribute).toHaveBeenCalledWith('role', 'admin');
    });

    it('should set sport in analytics', async () => {
      await analyticsService.setUserProperties({ sport: 'soccer' });

      expect(mockAnalytics.setUserProperty).toHaveBeenCalledWith('sport', 'soccer');
    });

    it('should set multiple properties', async () => {
      await analyticsService.setUserProperties({
        userId: 'user123',
        email: 'test@example.com',
        role: 'player',
        sport: 'basketball',
      });

      expect(mockAnalytics.setUserId).toHaveBeenCalledWith('user123');
      expect(mockCrashlytics.setAttribute).toHaveBeenCalledWith('email', 'test@example.com');
      expect(mockAnalytics.setUserProperty).toHaveBeenCalledWith('role', 'player');
      expect(mockAnalytics.setUserProperty).toHaveBeenCalledWith('sport', 'basketball');
    });
  });

  describe('Predefined Events', () => {
    it('should log login event', async () => {
      await analyticsService.logLogin('email');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('login', { method: 'email' });
    });

    it('should log signup event', async () => {
      await analyticsService.logSignUp('google');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('sign_up', { method: 'google' });
    });

    it('should log match join event', async () => {
      await analyticsService.logMatchJoin('match123', 'soccer');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('match_join', {
        match_id: 'match123',
        sport: 'soccer',
      });
    });

    it('should log match create event', async () => {
      await analyticsService.logMatchCreate('basketball');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('match_create', { sport: 'basketball' });
    });

    it('should log venue booking event', async () => {
      await analyticsService.logVenueBooking('venue123', 5000);

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('venue_booking', {
        venue_id: 'venue123',
        value: 5000,
        currency: 'USD',
      });
    });

    it('should log payment event', async () => {
      await analyticsService.logPayment(5000, 'USD', 'card');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('purchase', {
        value: 5000,
        currency: 'USD',
        payment_method: 'card',
      });
    });

    it('should log tournament join event', async () => {
      await analyticsService.logTournamentJoin('tournament123');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('tournament_join', {
        tournament_id: 'tournament123',
      });
    });

    it('should log team join event', async () => {
      await analyticsService.logTeamJoin('team123');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('team_join', { team_id: 'team123' });
    });

    it('should log search event', async () => {
      await analyticsService.logSearch('soccer match', 'matches');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('search', {
        search_term: 'soccer match',
        category: 'matches',
      });
    });

    it('should log share event', async () => {
      await analyticsService.logShare('match', 'match123', 'facebook');

      expect(mockAnalytics.logEvent).toHaveBeenCalledWith('share', {
        content_type: 'match',
        item_id: 'match123',
        method: 'facebook',
      });
    });
  });

  describe('Crashlytics', () => {
    it('should record error', () => {
      const error = new Error('Test error');

      analyticsService.recordError(error);

      expect(mockCrashlytics.recordError).toHaveBeenCalledWith(error);
    });

    it('should record error with context', () => {
      const error = new Error('Test error');

      analyticsService.recordError(error, 'Payment flow');

      expect(mockCrashlytics.log).toHaveBeenCalledWith('Error context: Payment flow');
      expect(mockCrashlytics.recordError).toHaveBeenCalledWith(error);
    });

    it('should log custom message', () => {
      analyticsService.log('Custom log message');

      expect(mockCrashlytics.log).toHaveBeenCalledWith('Custom log message');
    });

    it('should set custom attribute', () => {
      analyticsService.setAttribute('feature', 'payments');

      expect(mockCrashlytics.setAttribute).toHaveBeenCalledWith('feature', 'payments');
    });
  });

  describe('Collection Control', () => {
    it('should enable analytics collection', async () => {
      await analyticsService.setAnalyticsEnabled(true);

      expect(mockAnalytics.setAnalyticsCollectionEnabled).toHaveBeenCalledWith(true);
    });

    it('should disable analytics collection', async () => {
      await analyticsService.setAnalyticsEnabled(false);

      expect(mockAnalytics.setAnalyticsCollectionEnabled).toHaveBeenCalledWith(false);
    });

    it('should enable crashlytics collection', async () => {
      await analyticsService.setCrashlyticsEnabled(true);

      expect(mockCrashlytics.setCrashlyticsCollectionEnabled).toHaveBeenCalledWith(true);
    });

    it('should disable crashlytics collection', async () => {
      await analyticsService.setCrashlyticsEnabled(false);

      expect(mockCrashlytics.setCrashlyticsCollectionEnabled).toHaveBeenCalledWith(false);
    });
  });
});
