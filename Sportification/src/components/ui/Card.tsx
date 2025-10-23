import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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

const Card: React.FC<CardProps> = ({
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

  const handlePressIn = () => {
    if (onPress && animated) {
      scale.value = withSpring(0.98, theme.animations.spring.snappy);
      pressed.value = true;
    }
  };

  const handlePressOut = () => {
    if (onPress && animated) {
      scale.value = withSpring(1, theme.animations.spring.snappy);
      pressed.value = false;
    }
  };

  const variantStyles = {
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
  };

  const content = (
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
  );

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
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
