import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerSuccessNotification, triggerErrorNotification, triggerWarningNotification } from '@shared/utils/hapticFeedback';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Trigger haptic feedback based on toast type
    if (type === 'success') {
      triggerSuccessNotification();
    } else if (type === 'error') {
      triggerErrorNotification();
    } else if (type === 'warning') {
      triggerWarningNotification();
    }

    // Show toast
    translateY.value = withSpring(0, theme.animations.spring.smooth);
    opacity.value = withTiming(1, { duration: theme.animations.duration.normal });

    // Auto dismiss
    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
    // All dependencies are stable (shared values and theme constants)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hideToast = () => {
    translateY.value = withSpring(-100, theme.animations.spring.smooth);
    opacity.value = withTiming(0, { duration: theme.animations.duration.normal }, () => {
      if (onDismiss) {
        runOnJS(onDismiss)();
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const typeConfig = {
    success: {
      backgroundColor: theme.colors.successContainer,
      icon: 'check-circle',
      iconColor: theme.colors.success,
      textColor: theme.colors.onSecondaryContainer,
    },
    error: {
      backgroundColor: theme.colors.errorContainer,
      icon: 'alert-circle',
      iconColor: theme.colors.error,
      textColor: theme.colors.onErrorContainer,
    },
    warning: {
      backgroundColor: theme.colors.warningContainer,
      icon: 'alert',
      iconColor: theme.colors.warning,
      textColor: theme.colors.onTertiaryContainer,
    },
    info: {
      backgroundColor: theme.colors.infoContainer,
      icon: 'information',
      iconColor: theme.colors.info,
      textColor: theme.colors.onPrimaryContainer,
    },
  };

  const config = typeConfig[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.backgroundColor,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.base,
          margin: theme.spacing.base,
        },
        theme.elevation.md,
        animatedStyle,
      ]}
    >
      <Icon name={config.icon} size={24} color={config.iconColor} />
      <Text
        style={[
          theme.typography.bodyMedium,
          {
            color: config.textColor,
            marginLeft: theme.spacing.md,
            flex: 1,
          },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default Toast;
