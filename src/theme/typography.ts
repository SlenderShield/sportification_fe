import { TextStyle } from 'react-native';
import { getFontFamily } from './fonts';

// Typography scale following Material Design 3 and iOS HIG
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
};

export const fontWeights = {
  light: '300' as TextStyle['fontWeight'],
  normal: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
};

export const lineHeights = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 32,
  '2xl': 36,
  '3xl': 40,
  '4xl': 44,
  '5xl': 52,
  '6xl': 60,
};

export const typography = {
  // Display styles (largest)
  displayLarge: {
    fontSize: fontSizes['6xl'],
    lineHeight: lineHeights['6xl'],
    fontWeight: fontWeights.bold,
    fontFamily: getFontFamily('heading', 'bold'),
  },
  displayMedium: {
    fontSize: fontSizes['5xl'],
    lineHeight: lineHeights['5xl'],
    fontWeight: fontWeights.bold,
    fontFamily: getFontFamily('heading', 'bold'),
  },
  displaySmall: {
    fontSize: fontSizes['4xl'],
    lineHeight: lineHeights['4xl'],
    fontWeight: fontWeights.bold,
    fontFamily: getFontFamily('heading', 'bold'),
  },

  // Headline styles
  headlineLarge: {
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights['3xl'],
    fontWeight: fontWeights.bold,
    fontFamily: getFontFamily('heading', 'bold'),
  },
  headlineMedium: {
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
    fontWeight: fontWeights.semibold,
    fontFamily: getFontFamily('heading', 'semibold'),
  },
  headlineSmall: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    fontWeight: fontWeights.semibold,
    fontFamily: getFontFamily('heading', 'semibold'),
  },

  // Title styles
  titleLarge: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: fontWeights.semibold,
    fontFamily: getFontFamily('heading', 'semibold'),
  },
  titleMedium: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.base,
    fontWeight: fontWeights.semibold,
    fontFamily: getFontFamily('heading', 'semibold'),
  },
  titleSmall: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.semibold,
    fontFamily: getFontFamily('heading', 'semibold'),
  },

  // Body styles
  bodyLarge: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.base,
    fontWeight: fontWeights.normal,
    fontFamily: getFontFamily('body', 'regular'),
  },
  bodyMedium: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.normal,
    fontFamily: getFontFamily('body', 'regular'),
  },
  bodySmall: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.normal,
    fontFamily: getFontFamily('body', 'regular'),
  },

  // Label styles
  labelLarge: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: fontWeights.medium,
    fontFamily: getFontFamily('body', 'medium'),
  },
  labelMedium: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: fontWeights.medium,
    fontFamily: getFontFamily('body', 'medium'),
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeights.medium,
    fontFamily: getFontFamily('body', 'medium'),
  },
};

export type Typography = typeof typography;
