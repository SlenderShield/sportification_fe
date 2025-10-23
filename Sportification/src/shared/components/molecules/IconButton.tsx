import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerLightImpact } from '@shared/utils/hapticFeedback';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outlined' | 'text';
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'text',
  color,
  backgroundColor,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.9, theme.animations.spring.snappy);
      triggerLightImpact();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, theme.animations.spring.bouncy);
    }
  };

  const sizeConfig = {
    small: { container: 32, icon: 18 },
    medium: { container: 40, icon: 24 },
    large: { container: 48, icon: 28 },
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: backgroundColor || theme.colors.primary,
          ...theme.elevation.sm,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: color || theme.colors.outline,
        };
      case 'text':
      default:
        return {
          backgroundColor: 'transparent',
        };
    }
  };

  const getIconColor = () => {
    if (color) return color;
    if (variant === 'filled') return theme.colors.onPrimary;
    return theme.colors.primary;
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${icon} button`}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        testID={testID}
        style={[
          styles.button,
          {
            width: sizeConfig[size].container,
            height: sizeConfig[size].container,
            borderRadius: sizeConfig[size].container / 2,
            opacity: disabled ? 0.5 : 1,
          },
          getVariantStyle(),
        ]}
      >
        <Icon
          name={icon}
          size={sizeConfig[size].icon}
          color={getIconColor()}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconButton;
