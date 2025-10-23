import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  variant?: 'outlined' | 'filled';
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  containerStyle,
  style,
  value,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useSharedValue(value ? 1 : 0);
  const borderColor = useSharedValue(theme.colors.outline);

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            labelPosition.value === 1 ? -28 : 0,
            { duration: theme.animations.duration.fast }
          ),
        },
        {
          scale: withTiming(
            labelPosition.value === 1 ? 0.85 : 1,
            { duration: theme.animations.duration.fast }
          ),
        },
      ],
    };
  });

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(borderColor.value, {
        duration: theme.animations.duration.fast,
      }),
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    labelPosition.value = 1;
    borderColor.value = error ? theme.colors.error : theme.colors.primary;
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      labelPosition.value = 0;
    }
    borderColor.value = error ? theme.colors.error : theme.colors.outline;
    props.onBlur?.(e);
  };

  const variantStyles = {
    outlined: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.outline,
    },
    filled: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 0,
      borderBottomWidth: 2,
      borderBottomColor: error ? theme.colors.error : theme.colors.outline,
    },
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.inputContainer,
          variantStyles[variant],
          {
            borderRadius: variant === 'outlined' ? theme.borderRadius.md : 0,
            paddingLeft: leftIcon ? theme.spacing['2xl'] + theme.spacing.base : theme.spacing.base,
            paddingRight: rightIcon ? theme.spacing['2xl'] + theme.spacing.base : theme.spacing.base,
          },
          variant === 'outlined' && animatedBorderStyle,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon
              name={leftIcon}
              size={20}
              color={
                error
                  ? theme.colors.error
                  : isFocused
                  ? theme.colors.primary
                  : theme.colors.onSurfaceVariant
              }
            />
          </View>
        )}

        {label && (
          <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
            <Text
              style={[
                theme.typography.bodyMedium,
                {
                  color: error
                    ? theme.colors.error
                    : isFocused
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                  backgroundColor: variant === 'outlined' ? theme.colors.surface : 'transparent',
                  paddingHorizontal: 4,
                },
              ]}
            >
              {label}
            </Text>
          </Animated.View>
        )}

        <TextInput
          style={[
            styles.input,
            theme.typography.bodyLarge,
            {
              color: theme.colors.onSurface,
              paddingTop: label ? theme.spacing.base : theme.spacing.md,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          {...props}
        />

        {rightIcon && (
          <Pressable
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Icon
              name={rightIcon}
              size={20}
              color={
                error
                  ? theme.colors.error
                  : isFocused
                  ? theme.colors.primary
                  : theme.colors.onSurfaceVariant
              }
            />
          </Pressable>
        )}
      </Animated.View>

      {(error || helperText) && (
        <Text
          style={[
            theme.typography.bodySmall,
            {
              color: error ? theme.colors.error : theme.colors.onSurfaceVariant,
              marginTop: theme.spacing.xs,
              marginLeft: theme.spacing.base,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    left: 16,
    pointerEvents: 'none',
  },
  input: {
    paddingVertical: 12,
    minHeight: 56,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Input;
