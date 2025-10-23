import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerSelection } from '../../utils/hapticFeedback';

interface ChipProps {
  label: string;
  onPress?: () => void;
  onDelete?: () => void;
  icon?: string;
  selected?: boolean;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  onDelete,
  icon,
  selected = false,
  variant = 'filled',
  size = 'medium',
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
    scale.value = withSpring(0.95, theme.animations.spring.snappy);
    triggerSelection();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, theme.animations.spring.bouncy);
  };

  const sizeConfig = {
    small: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 12, iconSize: 14 },
    medium: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14, iconSize: 16 },
  };

  const getBackgroundColor = () => {
    if (variant === 'outlined') {
      return selected ? theme.colors.primaryContainer : 'transparent';
    }
    return selected ? theme.colors.primary : theme.colors.surfaceVariant;
  };

  const getTextColor = () => {
    if (variant === 'outlined') {
      return selected ? theme.colors.onPrimaryContainer : theme.colors.text;
    }
    return selected ? theme.colors.onPrimary : theme.colors.text;
  };

  const getBorderColor = () => {
    if (variant === 'outlined') {
      return selected ? theme.colors.primary : theme.colors.outline;
    }
    return 'transparent';
  };

  const config = sizeConfig[size];
  const isInteractive = onPress !== undefined;

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={isInteractive ? handlePressIn : undefined}
        onPressOut={isInteractive ? handlePressOut : undefined}
        disabled={!isInteractive}
        style={[
          styles.chip,
          {
            backgroundColor: getBackgroundColor(),
            borderWidth: variant === 'outlined' ? 1 : 0,
            borderColor: getBorderColor(),
            paddingVertical: config.paddingVertical,
            paddingHorizontal: config.paddingHorizontal,
            borderRadius: theme.borderRadius.full,
          },
        ]}
      >
        {icon && (
          <Icon
            name={icon}
            size={config.iconSize}
            color={getTextColor()}
            style={{ marginRight: 4 }}
          />
        )}
        <Text
          style={[
            styles.label,
            {
              color: getTextColor(),
              fontSize: config.fontSize,
              fontWeight: selected ? '600' : '400',
            },
          ]}
        >
          {label}
        </Text>
        {onDelete && (
          <Pressable
            onPress={onDelete}
            style={{ marginLeft: 4 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name="close-circle"
              size={config.iconSize}
              color={getTextColor()}
            />
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '500',
  },
});

export default Chip;
