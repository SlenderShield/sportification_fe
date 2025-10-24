import { Dimensions, Platform } from 'react-native';

export const getDeviceType = () => {
  const { width, height } = Dimensions.get('window');

  if (Platform.OS === 'ios' && Platform.isPad) {
    return 'tablet';
  }

  if (Platform.OS === 'android') {
    if (width >= 600 || height >= 600) {
      return 'tablet';
    }
  }

  return 'phone';
};

export const isTablet = () => getDeviceType() === 'tablet';

export const getResponsiveValue = <T,>(phoneValue: T, tabletValue: T): T => {
  return isTablet() ? tabletValue : phoneValue;
};

export const useResponsiveFontSize = () => {
  const deviceType = getDeviceType();
  const scaleFactor = deviceType === 'tablet' ? 1.3 : 1;

  return {
    tiny: 10 * scaleFactor,
    small: 12 * scaleFactor,
    medium: 14 * scaleFactor,
    large: 16 * scaleFactor,
    xlarge: 20 * scaleFactor,
    xxlarge: 24 * scaleFactor,
    huge: 32 * scaleFactor,
  };
};

export const useResponsiveSpacing = () => {
  const deviceType = getDeviceType();
  const scaleFactor = deviceType === 'tablet' ? 1.5 : 1;

  return {
    xs: 4 * scaleFactor,
    sm: 8 * scaleFactor,
    md: 16 * scaleFactor,
    lg: 24 * scaleFactor,
    xl: 32 * scaleFactor,
    xxl: 48 * scaleFactor,
  };
};

export const getOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height ? 'landscape' : 'portrait';
};

export const useResponsiveLayout = () => {
  const deviceType = getDeviceType();
  const orientation = getOrientation();

  return {
    isTablet: deviceType === 'tablet',
    isPhone: deviceType === 'phone',
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    numColumns: deviceType === 'tablet' && orientation === 'landscape' ? 3 : 
                 deviceType === 'tablet' ? 2 : 1,
    contentMaxWidth: deviceType === 'tablet' ? 768 : 480,
  };
};
