// Modern color palette based on Material Design 3 principles

export const lightColors = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',
  primaryContainer: '#E3F2FD',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#001C38',

  // Secondary colors
  secondary: '#34C759',
  secondaryLight: '#30D158',
  secondaryDark: '#28A745',
  secondaryContainer: '#E8F5E9',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#003A00',

  // Tertiary colors
  tertiary: '#FF9500',
  tertiaryLight: '#FFCC00',
  tertiaryDark: '#FF8000',
  tertiaryContainer: '#FFF3E0',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#331A00',

  // Error colors
  error: '#FF3B30',
  errorLight: '#FF6259',
  errorDark: '#C7001E',
  errorContainer: '#FFEBEE',
  onError: '#FFFFFF',
  onErrorContainer: '#410001',

  // Success colors
  success: '#34C759',
  successLight: '#30D158',
  successDark: '#28A745',
  successContainer: '#E8F5E9',

  // Warning colors
  warning: '#FF9500',
  warningLight: '#FFCC00',
  warningDark: '#FF8000',
  warningContainer: '#FFF3E0',

  // Info colors
  info: '#5AC8FA',
  infoLight: '#64D2FF',
  infoDark: '#0091D5',
  infoContainer: '#E3F2FD',

  // Background colors
  background: '#F5F5F7',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F7',
  surfaceContainer: '#FAFAFA',
  surfaceContainerHigh: '#ECECEC',

  // Text colors
  onBackground: '#1C1C1E',
  onSurface: '#1C1C1E',
  onSurfaceVariant: '#48484A',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textDisabled: '#C7C7CC',

  // Border colors
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  outline: '#C7C7CC',
  outlineVariant: '#E5E5EA',

  // Shadow colors
  shadow: '#000000',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.2)',
  shadowHeavy: 'rgba(0, 0, 0, 0.3)',

  // Other utility colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  divider: '#E5E5EA',
  disabled: '#C7C7CC',
  placeholder: '#8E8E93',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  scrim: 'rgba(0, 0, 0, 0.32)',
};

export const darkColors = {
  // Primary colors
  primary: '#0A84FF',
  primaryLight: '#64D2FF',
  primaryDark: '#0051D5',
  primaryContainer: '#004C99',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#B3E5FC',

  // Secondary colors
  secondary: '#30D158',
  secondaryLight: '#5AFF8C',
  secondaryDark: '#28A745',
  secondaryContainer: '#005005',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#A5D6A7',

  // Tertiary colors
  tertiary: '#FFD60A',
  tertiaryLight: '#FFEB3B',
  tertiaryDark: '#FFB300',
  tertiaryContainer: '#664D00',
  onTertiary: '#1C1C1E',
  onTertiaryContainer: '#FFE082',

  // Error colors
  error: '#FF453A',
  errorLight: '#FF6B6B',
  errorDark: '#C7001E',
  errorContainer: '#93000A',
  onError: '#FFFFFF',
  onErrorContainer: '#FFCDD2',

  // Success colors
  success: '#30D158',
  successLight: '#5AFF8C',
  successDark: '#28A745',
  successContainer: '#005005',

  // Warning colors
  warning: '#FFD60A',
  warningLight: '#FFEB3B',
  warningDark: '#FFB300',
  warningContainer: '#664D00',

  // Info colors
  info: '#64D2FF',
  infoLight: '#B3E5FC',
  infoDark: '#0091D5',
  infoContainer: '#004C99',

  // Background colors
  background: '#000000',
  backgroundElevated: '#1C1C1E',
  surface: '#1C1C1E',
  surfaceVariant: '#2C2C2E',
  surfaceContainer: '#3A3A3C',
  surfaceContainerHigh: '#48484A',

  // Text colors
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onSurfaceVariant: '#EBEBF5',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  textDisabled: '#636366',

  // Border colors
  border: '#38383A',
  borderLight: '#48484A',
  outline: '#636366',
  outlineVariant: '#48484A',

  // Shadow colors
  shadow: '#000000',
  shadowLight: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.5)',
  shadowHeavy: 'rgba(0, 0, 0, 0.7)',

  // Other utility colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  divider: '#38383A',
  disabled: '#636366',
  placeholder: '#8E8E93',
  backdrop: 'rgba(0, 0, 0, 0.6)',
  scrim: 'rgba(0, 0, 0, 0.5)',
};

export type ColorScheme = typeof lightColors;
