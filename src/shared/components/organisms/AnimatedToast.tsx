/**
 * AnimatedToast Component  
 * Toast notifications with Lottie animations for success/error states
 * Provides delightful visual feedback for user actions
 */

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../theme';
import LottieLoader from '../common/LottieLoader';
import { triggerSuccessNotification, triggerErrorNotification, triggerWarningNotification } from '@shared/utils/hapticFeedback';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface AnimatedToastProps {
  visible: boolean;
  type: ToastType;
  message: string;
  duration?: number;
  onHide?: () => void;
  showAnimation?: boolean;
}

const AnimatedToast: React.FC<AnimatedToastProps> = ({
  visible,
  type,
  message,
  duration = 3000,
  onHide,
  showAnimation = true,
}) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Trigger haptic feedback based on toast type
      if (type === 'success') {
        triggerSuccessNotification();
      } else if (type === 'error') {
        triggerErrorNotification();
      } else if (type === 'warning') {
        triggerWarningNotification();
      }

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
    // All dependencies are stable (animated values and constants)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.info;
    }
  };

  const getAnimationType = (): 'success' | 'error' | 'loading' => {
    if (type === 'success') return 'success';
    if (type === 'error') return 'error';
    return 'loading';
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {showAnimation && (
        <LottieLoader
          type={getAnimationType()}
          size={32}
          loop={false}
          style={styles.animation}
        />
      )}
      <Text style={[theme.typography.bodyMedium, styles.message]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  animation: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default AnimatedToast;
