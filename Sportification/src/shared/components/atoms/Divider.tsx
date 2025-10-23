import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

interface DividerProps {
  label?: string;
  variant?: 'solid' | 'dashed';
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

const Divider: React.FC<DividerProps> = ({
  label,
  variant = 'solid',
  orientation = 'horizontal',
  style,
  labelStyle,
}) => {
  const { theme } = useTheme();

  if (label && orientation === 'horizontal') {
    return (
      <View
        style={[
          styles.labelContainer,
          { marginVertical: theme.spacing.base },
          style,
        ]}
      >
        <View
          style={[
            styles.line,
            {
              backgroundColor: theme.colors.divider,
              borderStyle: variant,
              height: variant === 'dashed' ? 0 : 1,
              borderTopWidth: variant === 'dashed' ? 1 : 0,
              borderColor: variant === 'dashed' ? theme.colors.divider : undefined,
            },
          ]}
        />
        <Text
          style={[
            theme.typography.labelMedium,
            {
              color: theme.colors.textSecondary,
              marginHorizontal: theme.spacing.md,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
        <View
          style={[
            styles.line,
            {
              backgroundColor: theme.colors.divider,
              borderStyle: variant,
              height: variant === 'dashed' ? 0 : 1,
              borderTopWidth: variant === 'dashed' ? 1 : 0,
              borderColor: variant === 'dashed' ? theme.colors.divider : undefined,
            },
          ]}
        />
      </View>
    );
  }

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          {
            width: 1,
            backgroundColor: theme.colors.divider,
            borderStyle: variant,
            borderLeftWidth: variant === 'dashed' ? 1 : 0,
            borderColor: variant === 'dashed' ? theme.colors.divider : undefined,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: theme.colors.divider,
          borderStyle: variant,
          borderTopWidth: variant === 'dashed' ? 1 : 0,
          borderColor: variant === 'dashed' ? theme.colors.divider : undefined,
          marginVertical: theme.spacing.sm,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
  },
});

export default Divider;
