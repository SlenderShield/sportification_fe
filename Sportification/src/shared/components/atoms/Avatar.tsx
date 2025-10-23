import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import OptimizedImage from './OptimizedImage';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'circular' | 'rounded' | 'square';
  backgroundColor?: string;
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  variant = 'circular',
  backgroundColor,
  style,
}) => {
  const { theme } = useTheme();

  const sizeStyles = {
    small: { width: 32, height: 32, fontSize: 14 },
    medium: { width: 48, height: 48, fontSize: 20 },
    large: { width: 64, height: 64, fontSize: 28 },
    xlarge: { width: 96, height: 96, fontSize: 40 },
  };

  const variantStyles = {
    circular: { borderRadius: sizeStyles[size].width / 2 },
    rounded: { borderRadius: theme.borderRadius.md },
    square: { borderRadius: 0 },
  };

  const getInitials = (name: string): string => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const bgColor = backgroundColor || theme.colors.primary;

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeStyles[size].width,
          height: sizeStyles[size].height,
        },
        variantStyles[variant],
        { backgroundColor: bgColor },
        style,
      ]}
    >
      {source ? (
        <OptimizedImage
          source={source}
          style={[
            {
              width: sizeStyles[size].width,
              height: sizeStyles[size].height,
            },
            variantStyles[variant],
          ]}
          placeholder
          placeholderColor={bgColor}
          cacheEnabled
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeStyles[size].fontSize,
              color: theme.colors.onPrimary,
            },
          ]}
          allowFontScaling
        >
          {name ? getInitials(name) : '?'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    fontWeight: '600',
  },
});

export default Avatar;
