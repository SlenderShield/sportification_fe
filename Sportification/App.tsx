import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { I18nextProvider } from 'react-i18next';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme';
import { AccessibilityProvider } from './src/contexts/AccessibilityContext';
import { ContainerProvider } from './src/core/di';
import { notificationService } from './src/shared/services/notificationService';
import { localizationService, i18n } from './src/shared/services/localizationService';
import { paymentService } from './src/features/profile/services/paymentService';
import { analyticsService } from './src/shared/services/analyticsService';
import { LoadingSpinner } from './src/shared/components/atoms';

// Stripe publishable key - should be loaded from env
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';

/**
 * ThemedApp Component
 * Wraps the app content with ThemeProvider that responds to accessibility settings
 */
const ThemedApp = () => {
  return (
    <ContainerProvider>
      <AccessibilityProvider>
        <ThemeProviderWithAccessibility>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <Provider store={store}>
            <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
              <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
                <I18nextProvider i18n={i18n}>
                  <RootNavigator />
                </I18nextProvider>
              </StripeProvider>
            </PersistGate>
          </Provider>
        </ThemeProviderWithAccessibility>
      </AccessibilityProvider>
    </ContainerProvider>
  );
};

/**
 * ThemeProviderWithAccessibility Component
 * Connects AccessibilityContext with ThemeProvider
 */
const ThemeProviderWithAccessibility: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Import within component to access the context
  const { useAccessibility } = require('./src/contexts/AccessibilityContext');
  const { settings } = useAccessibility();

  return (
    <ThemeProvider highContrastMode={settings.highContrastMode}>
      {children}
    </ThemeProvider>
  );
};

const App = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Load language preferences
    await localizationService.loadLanguagePreference();

    // Initialize analytics
    await analyticsService.setAnalyticsEnabled(true);
    await analyticsService.setCrashlyticsEnabled(true);

    // Initialize Stripe
    if (STRIPE_PUBLISHABLE_KEY) {
      try {
        await paymentService.initialize(STRIPE_PUBLISHABLE_KEY, 'merchant.sportification');
      } catch (error) {
        console.error('Stripe initialization failed:', error);
        analyticsService.recordError(
          error instanceof Error ? error : new Error('Stripe init failed'),
          'App initialization'
        );
      }
    }

    // Initialize notifications (mobile only)
    if (Platform.OS !== 'web') {
      try {
        await notificationService.initialize();
        const token = await notificationService.getToken();
        if (token) {
          await notificationService.sendTokenToServer(token);
        }

        // Listen for token refresh
        const unsubscribe = notificationService.onTokenRefresh(async (newToken) => {
          await notificationService.sendTokenToServer(newToken);
        });

        return () => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error('Notification initialization failed:', error);
        analyticsService.recordError(
          error instanceof Error ? error : new Error('Notification init failed'),
          'App initialization'
        );
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemedApp />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
