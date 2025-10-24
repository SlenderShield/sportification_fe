import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessibilitySettings {
  // Dynamic text sizing
  fontScale: number;
  allowFontScaling: boolean;
  
  // High contrast mode for color blindness
  highContrastMode: boolean;
  
  // Reduced motion
  reduceMotion: boolean;
  
  // Screen reader
  screenReaderEnabled: boolean;
  
  // Bold text
  boldTextEnabled: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultSettings: AccessibilitySettings = {
  fontScale: 1.0,
  allowFontScaling: true,
  highContrastMode: false,
  reduceMotion: false,
  screenReaderEnabled: false,
  boldTextEnabled: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = '@accessibility_settings';

interface AccessibilityProviderProps {
  children: ReactNode;
}

/**
 * AccessibilityProvider
 * 
 * Provides accessibility settings throughout the app.
 * Detects system accessibility preferences and allows user overrides.
 * 
 * Features:
 * - Dynamic text sizing
 * - High contrast mode
 * - Reduced motion
 * - Screen reader detection
 * - Bold text support
 * - Settings persistence
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load saved settings and detect system preferences
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load saved settings
        const savedSettings = await AsyncStorage.getItem(STORAGE_KEY);
        let userSettings: Partial<AccessibilitySettings> = {};
        
        if (savedSettings) {
          userSettings = JSON.parse(savedSettings);
        }

        // Detect system accessibility settings
        const [isScreenReaderEnabled, isBoldTextEnabled, isReduceMotionEnabled] = await Promise.all([
          AccessibilityInfo.isScreenReaderEnabled(),
          Platform.OS === 'ios' ? AccessibilityInfo.isBoldTextEnabled() : Promise.resolve(false),
          Platform.OS === 'ios' ? AccessibilityInfo.isReduceMotionEnabled() : Promise.resolve(false),
        ]);

        // Merge user settings with detected system settings
        const mergedSettings: AccessibilitySettings = {
          ...defaultSettings,
          screenReaderEnabled: isScreenReaderEnabled,
          boldTextEnabled: isBoldTextEnabled,
          reduceMotion: isReduceMotionEnabled,
          ...userSettings,
        };

        setSettings(mergedSettings);
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
        setSettings(defaultSettings);
      }
    };

    loadSettings();

    // Listen for screen reader changes
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled: boolean) => {
        setSettings(prev => ({ ...prev, screenReaderEnabled: enabled }));
      }
    );

    // Listen for bold text changes (iOS only)
    let boldTextListener: any;
    if (Platform.OS === 'ios') {
      boldTextListener = AccessibilityInfo.addEventListener(
        'boldTextChanged',
        (enabled: boolean) => {
          setSettings(prev => ({ ...prev, boldTextEnabled: enabled }));
        }
      );
    }

    // Listen for reduce motion changes (iOS only)
    let reduceMotionListener: any;
    if (Platform.OS === 'ios') {
      reduceMotionListener = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        (enabled: boolean) => {
          setSettings(prev => ({ ...prev, reduceMotion: enabled }));
        }
      );
    }

    return () => {
      screenReaderListener?.remove();
      boldTextListener?.remove();
      reduceMotionListener?.remove();
    };
  }, []);

  const updateSetting = async <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ): Promise<void> => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);

      // Save user preferences (excluding system-detected settings)
      const { screenReaderEnabled: _screenReader, boldTextEnabled: _boldText, reduceMotion: _reduceMotion, ...userSettings } = newSettings;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userSettings));
    } catch (error) {
      console.error('Failed to save accessibility setting:', error);
    }
  };

  const resetSettings = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      
      // Keep system-detected settings
      const [isScreenReaderEnabled, isBoldTextEnabled, isReduceMotionEnabled] = await Promise.all([
        AccessibilityInfo.isScreenReaderEnabled(),
        Platform.OS === 'ios' ? AccessibilityInfo.isBoldTextEnabled() : Promise.resolve(false),
        Platform.OS === 'ios' ? AccessibilityInfo.isReduceMotionEnabled() : Promise.resolve(false),
      ]);

      setSettings({
        ...defaultSettings,
        screenReaderEnabled: isScreenReaderEnabled,
        boldTextEnabled: isBoldTextEnabled,
        reduceMotion: isReduceMotionEnabled,
      });
    } catch (error) {
      console.error('Failed to reset accessibility settings:', error);
    }
  };

  const value: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook to access accessibility settings
 * 
 * @example
 * ```typescript
 * const { settings, updateSetting } = useAccessibility();
 * 
 * // Check if high contrast mode is enabled
 * if (settings.highContrastMode) {
 *   // Use high contrast colors
 * }
 * 
 * // Update a setting
 * await updateSetting('highContrastMode', true);
 * ```
 */
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

/**
 * Get scaled font size based on accessibility settings
 * 
 * @param baseSize - Base font size
 * @param fontScale - Current font scale from accessibility settings
 * @param maxScale - Maximum scale allowed (default: 2.0)
 * @returns Scaled font size
 */
export const getScaledFontSize = (
  baseSize: number,
  fontScale: number = 1.0,
  maxScale: number = 2.0
): number => {
  const scale = Math.min(fontScale, maxScale);
  return Math.round(baseSize * scale);
};
