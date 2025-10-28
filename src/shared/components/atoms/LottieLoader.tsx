/**
 * LottieLoader Component
 * Enhanced loading component with Lottie animations
 * Provides better visual feedback than standard ActivityIndicator
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { loadingAnimation, successAnimation, errorAnimation } from '../../assets/animations';

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
  const getAnimationSource = () => {
    switch (type) {
      case 'success':
        return successAnimation;
      case 'error':
        return errorAnimation;
      case 'loading':
      default:
        return loadingAnimation;
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
