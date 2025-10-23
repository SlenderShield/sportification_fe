/**
 * LottieLoader Component
 * Enhanced loading component with Lottie animations
 * Provides better visual feedback than standard ActivityIndicator
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';

type AnimationType = 'loading' | 'success' | 'error';

interface LottieLoaderProps {
  type?: AnimationType;
  size?: number;
  loop?: boolean;
  autoPlay?: boolean;
  style?: ViewStyle;
  onAnimationFinish?: () => void;
}

const LottieLoader: React.FC<LottieLoaderProps> = ({
  type = 'loading',
  size = 100,
  loop = true,
  autoPlay = true,
  style,
  onAnimationFinish,
}) => {
  // Note: In a real implementation, you would include actual Lottie JSON files
  // For now, we'll use a placeholder that gracefully falls back
  
  const getAnimationSource = () => {
    // These would be actual Lottie animation JSON files
    // Example: require('./animations/loading.json')
    switch (type) {
      case 'success':
        return null; // require('./animations/success.json')
      case 'error':
        return null; // require('./animations/error.json')
      case 'loading':
      default:
        return null; // require('./animations/loading.json')
    }
  };

  const source = getAnimationSource();

  // Fallback to simple view if no animation source
  if (!source) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.placeholder, { width: size, height: size }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        style={{ width: size, height: size }}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: 'transparent',
  },
});

export default LottieLoader;
