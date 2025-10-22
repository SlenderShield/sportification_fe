import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const variantStyles = {
    default: {
      backgroundColor: theme.colors.primaryContainer,
      color: theme.colors.onPrimaryContainer,
    },
    success: {
      backgroundColor: theme.colors.successContainer,
      color: theme.colors.onSecondaryContainer,
    },
    error: {
      backgroundColor: theme.colors.errorContainer,
      color: theme.colors.onErrorContainer,
    },
    warning: {
      backgroundColor: theme.colors.warningContainer,
      color: theme.colors.onTertiaryContainer,
    },
    info: {
      backgroundColor: theme.colors.infoContainer,
      color: theme.colors.onPrimaryContainer,
    },
  };

  const sizeStyles = {
    small: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xs,
    },
    medium: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    large: {
      paddingHorizontal: theme.spacing.base,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
  };

  const textSizeStyles = {
    small: theme.typography.labelSmall,
    medium: theme.typography.labelMedium,
    large: theme.typography.labelLarge,
  };

  return (
    <View
      style={[
        styles.badge,
        sizeStyles[size],
        { backgroundColor: variantStyles[variant].backgroundColor },
        style,
      ]}
    >
      <Text
        style={[
          textSizeStyles[size],
          { color: variantStyles[variant].color },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
});

export default Badge;
