import React, { ReactNode } from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface FABProps {
  icon?: string;
  children?: ReactNode;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'tertiary';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  style?: ViewStyle;
}

const FAB: React.FC<FABProps> = ({
  icon = 'plus',
  children,
  onPress,
  size = 'medium',
  variant = 'primary',
  position = 'bottom-right',
  style,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9, theme.animations.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, theme.animations.spring.bouncy);
  };

  const sizeStyles = {
    small: { width: 40, height: 40, borderRadius: 12 },
    medium: { width: 56, height: 56, borderRadius: 16 },
    large: { width: 72, height: 72, borderRadius: 20 },
  };

  const iconSizes = {
    small: 20,
    medium: 24,
    large: 32,
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
    },
    tertiary: {
      backgroundColor: theme.colors.tertiary,
    },
  };

  const positionStyles = {
    'bottom-right': styles.positionBottomRight,
    'bottom-center': styles.positionBottomCenter,
    'bottom-left': styles.positionBottomLeft,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyles[position],
        sizeStyles[size],
        variantStyles[variant],
        theme.elevation.lg,
        animatedStyle,
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.pressable, sizeStyles[size]]}
      >
        {children || (
          <Icon
            name={icon}
            size={iconSizes[size]}
            color={theme.colors.onPrimary}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionBottomRight: {
    bottom: 16,
    right: 16,
  },
  positionBottomCenter: {
    bottom: 16,
    alignSelf: 'center',
  },
  positionBottomLeft: {
    bottom: 16,
    left: 16,
  },
});

export default FAB;
