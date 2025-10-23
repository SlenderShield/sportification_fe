import { lightColors, darkColors, highContrastLightColors, highContrastDarkColors, ColorScheme } from './colors';
import { typography, Typography } from './typography';
import { spacing, Spacing } from './spacing';
import { elevation, Elevation } from './elevation';
import { animations, Animations } from './animations';
import { borderRadius, BorderRadius } from './borderRadius';

export interface Theme {
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
  elevation: Elevation;
  animations: Animations;
  borderRadius: BorderRadius;
  isDark: boolean;
  isHighContrast?: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  elevation,
  animations,
  borderRadius,
  isDark: false,
  isHighContrast: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  elevation,
  animations,
  borderRadius,
  isDark: true,
  isHighContrast: false,
};

export const highContrastLightTheme: Theme = {
  colors: highContrastLightColors,
  typography,
  spacing,
  elevation,
  animations,
  borderRadius,
  isDark: false,
  isHighContrast: true,
};

export const highContrastDarkTheme: Theme = {
  colors: highContrastDarkColors,
  typography,
  spacing,
  elevation,
  animations,
  borderRadius,
  isDark: true,
  isHighContrast: true,
};
