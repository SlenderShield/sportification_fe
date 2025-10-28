/**
 * Custom Font Configuration
 * 
 * This file manages custom brand fonts for the application.
 * To add custom fonts:
 * 1. Add font files to assets/fonts/
 * 2. Update the fontConfig object below
 * 3. Load fonts using the loadCustomFonts function
 */

// Font configuration
// Update these values when custom fonts are added
export const fontConfig = {
  // Primary font family for headings and titles
  heading: {
    light: 'System', // Replace with custom font name, e.g., 'Montserrat-Light'
    regular: 'System', // Replace with 'Montserrat-Regular'
    medium: 'System', // Replace with 'Montserrat-Medium'
    semibold: 'System', // Replace with 'Montserrat-SemiBold'
    bold: 'System', // Replace with 'Montserrat-Bold'
  },
  
  // Secondary font family for body text
  body: {
    light: 'System', // Replace with custom font name, e.g., 'OpenSans-Light'
    regular: 'System', // Replace with 'OpenSans-Regular'
    medium: 'System', // Replace with 'OpenSans-Medium'
    semibold: 'System', // Replace with 'OpenSans-SemiBold'
    bold: 'System', // Replace with 'OpenSans-Bold'
  },
};

/**
 * Font family getter
 * Returns the appropriate font family based on weight and type
 */
export const getFontFamily = (
  type: 'heading' | 'body',
  weight: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' = 'regular'
): string => {
  return fontConfig[type][weight];
};

/**
 * Check if custom fonts are configured
 */
export const hasCustomFonts = (): boolean => {
  return (
    fontConfig.heading.regular !== 'System' ||
    fontConfig.body.regular !== 'System'
  );
};

/**
 * Font loading instructions
 * 
 * To use custom fonts in React Native:
 * 
 * 1. Install expo-font (if not using Expo, skip this):
 *    npm install expo-font
 * 
 * 2. Add font files to assets/fonts/:
 *    - Montserrat-Light.ttf
 *    - Montserrat-Regular.ttf
 *    - Montserrat-Medium.ttf
 *    - Montserrat-SemiBold.ttf
 *    - Montserrat-Bold.ttf
 *    - OpenSans-Light.ttf
 *    - OpenSans-Regular.ttf
 *    - OpenSans-Medium.ttf
 *    - OpenSans-SemiBold.ttf
 *    - OpenSans-Bold.ttf
 * 
 * 3. Update fontConfig above with actual font names
 * 
 * 4. Load fonts in App.tsx before rendering:
 *    import * as Font from 'expo-font';
 *    
 *    const loadFonts = async () => {
 *      await Font.loadAsync({
 *        'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
 *        'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
 *        // ... load all fonts
 *      });
 *    };
 * 
 * For non-Expo projects, see: https://reactnative.dev/docs/custom-fonts
 */

export default fontConfig;
