import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  role?: string;
  sport?: string;
}

class AnalyticsService {
  /**
   * Log a custom event
   */
  async logEvent(eventName: string, params?: Record<string, any>): Promise<void> {
    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('Analytics log event error:', error);
    }
  }

  /**
   * Log screen view
   */
  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error('Analytics screen view error:', error);
    }
  }

  /**
   * Set user properties
   */
  async setUserProperties(properties: UserProperties): Promise<void> {
    try {
      if (properties.userId) {
        await analytics().setUserId(properties.userId);
        await crashlytics().setUserId(properties.userId);
      }
      if (properties.email) {
        await crashlytics().setAttribute('email', properties.email);
      }
      if (properties.role) {
        await analytics().setUserProperty('role', properties.role);
        await crashlytics().setAttribute('role', properties.role);
      }
      if (properties.sport) {
        await analytics().setUserProperty('sport', properties.sport);
      }
    } catch (error) {
      console.error('Set user properties error:', error);
    }
  }

  /**
   * Log login event
   */
  async logLogin(method: string): Promise<void> {
    await this.logEvent('login', { method });
  }

  /**
   * Log signup event
   */
  async logSignUp(method: string): Promise<void> {
    await this.logEvent('sign_up', { method });
  }

  /**
   * Log match join event
   */
  async logMatchJoin(matchId: string, sport: string): Promise<void> {
    await this.logEvent('match_join', { match_id: matchId, sport });
  }

  /**
   * Log match create event
   */
  async logMatchCreate(sport: string): Promise<void> {
    await this.logEvent('match_create', { sport });
  }

  /**
   * Log venue booking event
   */
  async logVenueBooking(venueId: string, amount: number): Promise<void> {
    await this.logEvent('venue_booking', { 
      venue_id: venueId, 
      value: amount,
      currency: 'USD',
    });
  }

  /**
   * Log payment event
   */
  async logPayment(amount: number, currency: string, paymentMethod: string): Promise<void> {
    await this.logEvent('purchase', {
      value: amount,
      currency,
      payment_method: paymentMethod,
    });
  }

  /**
   * Log tournament join event
   */
  async logTournamentJoin(tournamentId: string): Promise<void> {
    await this.logEvent('tournament_join', { tournament_id: tournamentId });
  }

  /**
   * Log team join event
   */
  async logTeamJoin(teamId: string): Promise<void> {
    await this.logEvent('team_join', { team_id: teamId });
  }

  /**
   * Log search event
   */
  async logSearch(searchTerm: string, category: string): Promise<void> {
    await this.logEvent('search', { 
      search_term: searchTerm,
      category,
    });
  }

  /**
   * Log share event
   */
  async logShare(contentType: string, contentId: string, method: string): Promise<void> {
    await this.logEvent('share', {
      content_type: contentType,
      item_id: contentId,
      method,
    });
  }

  /**
   * Log error to crashlytics
   */
  recordError(error: Error, context?: string): void {
    try {
      if (context) {
        crashlytics().log(`Error context: ${context}`);
      }
      crashlytics().recordError(error);
    } catch (err) {
      console.error('Crashlytics record error failed:', err);
    }
  }

  /**
   * Log custom log to crashlytics
   */
  log(message: string): void {
    try {
      crashlytics().log(message);
    } catch (error) {
      console.error('Crashlytics log error:', error);
    }
  }

  /**
   * Set custom attributes for crash reports
   */
  setAttribute(key: string, value: string): void {
    try {
      crashlytics().setAttribute(key, value);
    } catch (error) {
      console.error('Set attribute error:', error);
    }
  }

  /**
   * Enable/disable analytics collection
   */
  async setAnalyticsEnabled(enabled: boolean): Promise<void> {
    try {
      await analytics().setAnalyticsCollectionEnabled(enabled);
    } catch (error) {
      console.error('Set analytics enabled error:', error);
    }
  }

  /**
   * Enable/disable crashlytics collection
   */
  async setCrashlyticsEnabled(enabled: boolean): Promise<void> {
    try {
      await crashlytics().setCrashlyticsCollectionEnabled(enabled);
    } catch (error) {
      console.error('Set crashlytics enabled error:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
