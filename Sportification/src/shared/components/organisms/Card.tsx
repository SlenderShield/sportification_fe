import React, { ReactNode, useCallback, useMemo } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onPress?: () => void;
  style?: ViewStyle;
  animated?: boolean;
}

const Card: React.FC<CardProps> = React.memo(({
  children,
  variant = 'elevated',
  elevation = 'md',
  onPress,
  style,
  animated = true,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const pressed = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: pressed.value ? 0.9 : 1,
    };
  });

  const handlePressIn = useCallback(() => {
    if (onPress && animated) {
      scale.value = withSpring(0.98, theme.animations.spring.snappy);
      pressed.value = true;
    }
  }, [onPress, animated, scale, pressed, theme]);

  const handlePressOut = useCallback(() => {
    if (onPress && animated) {
      scale.value = withSpring(1, theme.animations.spring.snappy);
      pressed.value = false;
    }
  }, [onPress, animated, scale, pressed, theme]);

  const variantStyles = useMemo(() => ({
    elevated: {
      backgroundColor: theme.colors.surface,
      ...theme.elevation[elevation],
    },
    outlined: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    filled: {
      backgroundColor: theme.colors.surfaceVariant,
    },
  }), [theme, elevation]);

  const content = useMemo(() => (
    <View
      style={[
        styles.card,
        variantStyles[variant],
        { borderRadius: theme.borderRadius.lg },
        style,
      ]}
    >
      {children}
    </View>
  ), [children, theme, variant, variantStyles, style]);

  if (onPress) {
    return (
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
        <Animated.View style={animated ? animatedStyle : undefined}>
          {content}
        </Animated.View>
      </Pressable>
    );
  }

  return content;
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
