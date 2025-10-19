import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { notificationService } from './src/services/notificationService';

const App = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      notificationService.initialize().then(async () => {
        const token = await notificationService.getToken();
        if (token) {
          await notificationService.sendTokenToServer(token);
        }
      });

      const unsubscribe = notificationService.onTokenRefresh(async (token) => {
        await notificationService.sendTokenToServer(token);
      });

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <RootNavigator />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
