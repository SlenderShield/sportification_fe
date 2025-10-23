import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  variant?: 'text' | 'circular' | 'rectangular';
  style?: ViewStyle;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 16,
  variant = 'text',
  style,
}) => {
  const { theme } = useTheme();
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animation.value, [0, 0.5, 1], [0.3, 0.7, 0.3]);
    return { opacity };
  });

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'circular':
        return {
          width: height,
          height,
          borderRadius: height / 2,
        };
      case 'text':
        return {
          width: width as number | undefined,
          height,
          borderRadius: theme.borderRadius.xs,
        };
      case 'rectangular':
      default:
        return {
          width: width as number | undefined,
          height,
          borderRadius: theme.borderRadius.sm,
        };
    }
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          backgroundColor: theme.colors.surfaceVariant,
        },
        getVariantStyle(),
        animatedStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

export default SkeletonLoader;

// Helper component for complex skeleton layouts
export const SkeletonCard: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={{ padding: theme.spacing.base }}>
      <View style={{ flexDirection: 'row', marginBottom: theme.spacing.md }}>
        <SkeletonLoader variant="circular" height={48} style={{ marginRight: theme.spacing.md }} />
        <View style={{ flex: 1 }}>
          <SkeletonLoader height={16} style={{ marginBottom: theme.spacing.sm }} />
          <SkeletonLoader height={12} width="60%" />
        </View>
      </View>
      <SkeletonLoader height={80} style={{ marginBottom: theme.spacing.sm }} />
      <SkeletonLoader height={12} style={{ marginBottom: theme.spacing.xs }} />
      <SkeletonLoader height={12} width="80%" />
    </View>
  );
};
