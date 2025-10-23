import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setUser, setLoading } from '../store/slices/authSlice';
import { apiService } from '../services/api';
import { socketService } from '../services/socketService';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { LoadingSpinner } from '@shared/components/atoms';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await apiService.getAccessToken();
        if (token) {
          const axiosInstance = apiService.getAxiosInstance();
          const response = await axiosInstance.get('/auth/profile');

          if (response.data.success && response.data.data) {
            dispatch(setUser(response.data.data));
            await socketService.connect();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        await apiService.clearTokens();
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
