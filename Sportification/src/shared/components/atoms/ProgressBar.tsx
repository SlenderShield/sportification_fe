import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'default',
  size = 'medium',
  showLabel = false,
  label,
  animated = true,
  style,
}) => {
  const { theme } = useTheme();
  const progressValue = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      progressValue.value = withSpring(progress, theme.animations.spring.smooth);
    } else {
      progressValue.value = progress;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${Math.min(Math.max(progressValue.value, 0), 100)}%`,
    };
  });

  const heights = {
    small: 4,
    medium: 8,
    large: 12,
  };

  const variantColors = {
    default: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
  };

  return (
    <View style={style}>
      {(showLabel || label) && (
        <View style={[styles.labelContainer, { marginBottom: theme.spacing.xs }]}>
          <Text style={[theme.typography.labelSmall, { color: theme.colors.textSecondary }]}>
            {label || `${Math.round(progress)}%`}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height: heights[size],
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: heights[size] / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              height: heights[size],
              backgroundColor: variantColors[variant],
              borderRadius: heights[size] / 2,
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default ProgressBar;
