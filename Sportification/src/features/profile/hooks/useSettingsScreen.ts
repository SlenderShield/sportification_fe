import { useState, useCallback } from 'react';

export function useSettingsScreen(navigation: any) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleAccessibility = useCallback(() => {
    navigation.navigate('AccessibilitySettings');
  }, [navigation]);

  const handleChangePassword = useCallback(() => {
    navigation.navigate('ChangePassword');
  }, [navigation]);

  const handleToggleNotifications = useCallback(() => {
    setNotificationsEnabled(prev => !prev);
  }, []);

  const handleToggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  return {
    notificationsEnabled,
    darkMode,
    onAccessibility: handleAccessibility,
    onChangePassword: handleChangePassword,
    onToggleNotifications: handleToggleNotifications,
    onToggleDarkMode: handleToggleDarkMode,
  };
}
