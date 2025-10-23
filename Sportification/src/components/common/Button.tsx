import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerLightImpact } from '../../utils/hapticFeedback';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (!isDisabled) {
      scale.value = withSpring(0.96, theme.animations.spring.snappy);
      opacity.value = withTiming(0.8, { duration: theme.animations.duration.fast });
      triggerLightImpact();
    }
  };

  const handlePressOut = () => {
    if (!isDisabled) {
      scale.value = withSpring(1, theme.animations.spring.bouncy);
      opacity.value = withTiming(1, { duration: theme.animations.duration.fast });
    }
  };

  const sizeStyles = {
    small: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.base,
      minHeight: 36,
    },
    medium: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      minHeight: 48,
    },
    large: {
      paddingVertical: theme.spacing.base,
      paddingHorizontal: theme.spacing['2xl'],
      minHeight: 56,
    },
  };

  const textSizeStyles = {
    small: theme.typography.labelMedium,
    medium: theme.typography.labelLarge,
    large: theme.typography.titleMedium,
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.onPrimary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.onSecondary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.outline,
      color: theme.colors.primary,
    },
    text: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
    },
  };

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: isDisabled,
          busy: loading,
        }}
        testID={testID}
        style={[
          styles.button,
          sizeStyles[size],
          {
            backgroundColor: variantStyles[variant].backgroundColor,
            borderRadius: theme.borderRadius.md,
          },
          variant === 'outline' && {
            borderWidth: variantStyles.outline.borderWidth,
            borderColor: variantStyles.outline.borderColor,
          },
          isDisabled && { opacity: 0.5 },
          theme.elevation[variant === 'primary' || variant === 'secondary' ? 'sm' : 'none'],
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variantStyles[variant].color}
            size={size === 'small' ? 'small' : 'small'}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Icon
                name={icon}
                size={iconSizes[size]}
                color={variantStyles[variant].color}
                style={{ marginRight: theme.spacing.sm }}
              />
            )}
            <Text
              style={[
                textSizeStyles[size],
                { color: variantStyles[variant].color },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Icon
                name={icon}
                size={iconSizes[size]}
                color={variantStyles[variant].color}
                style={{ marginLeft: theme.spacing.sm }}
              />
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;
