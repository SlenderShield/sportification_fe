import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme, highContrastLightTheme, highContrastDarkTheme } from './theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  highContrastMode: boolean;
  setHighContrastMode: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@sportification_theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
  highContrastMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  highContrastMode: externalHighContrast = false 
}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [highContrastMode, setHighContrastModeState] = useState(externalHighContrast);
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update theme when mode, system preference, or high contrast changes
  useEffect(() => {
    const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
    
    // Select appropriate theme based on dark mode and high contrast
    let selectedTheme: Theme;
    if (highContrastMode) {
      selectedTheme = isDark ? highContrastDarkTheme : highContrastLightTheme;
    } else {
      selectedTheme = isDark ? darkTheme : lightTheme;
    }
    
    setCurrentTheme(selectedTheme);
  }, [themeMode, systemColorScheme, highContrastMode]);

  // Sync with external high contrast mode prop (from AccessibilityContext)
  useEffect(() => {
    setHighContrastModeState(externalHighContrast);
  }, [externalHighContrast]);

  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = currentTheme.isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const setHighContrastMode = (enabled: boolean) => {
    setHighContrastModeState(enabled);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        themeMode,
        setThemeMode,
        toggleTheme,
        highContrastMode,
        setHighContrastMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
