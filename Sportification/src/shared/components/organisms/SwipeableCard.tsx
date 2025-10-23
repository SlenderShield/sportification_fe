/**
 * SwipeableCard Component
 * Card with swipe-to-delete and swipe actions
 * Provides modern mobile UX for quick actions
 */

import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { IconButton } from './';
import { useTheme } from '../../theme';

export interface SwipeAction {
  icon: string;
  color: string;
  onPress: () => void;
  label?: string;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  deleteThreshold?: number;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onDelete,
  leftActions = [],
  rightActions = [],
  deleteThreshold = 80,
}) => {
  const { theme } = useTheme();

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    if (leftActions.length === 0) return null;

    const translateX = dragX.interpolate({
      inputRange: [0, leftActions.length * 80],
      outputRange: [-leftActions.length * 80, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.actionsContainer,
          { transform: [{ translateX }] },
        ]}
      >
        {leftActions.map((action, index) => (
          <View
            key={index}
            style={[
              styles.actionButton,
              { backgroundColor: action.color },
            ]}
          >
            <IconButton
              icon={action.icon}
              onPress={action.onPress}
              size="small"
              variant="filled"
              color={action.color}
            />
            {action.label && (
              <Text style={[styles.actionLabel, theme.typography.labelSmall]}>
                {action.label}
              </Text>
            )}
          </View>
        ))}
      </Animated.View>
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const actions = onDelete
      ? [
          ...rightActions,
          {
            icon: 'delete',
            color: theme.colors.error,
            onPress: onDelete,
            label: 'Delete',
          },
        ]
      : rightActions;

    if (actions.length === 0) return null;

    const translateX = dragX.interpolate({
      inputRange: [-actions.length * 80, 0],
      outputRange: [0, actions.length * 80],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.actionsContainer,
          { transform: [{ translateX }] },
        ]}
      >
        {actions.map((action, index) => (
          <View
            key={index}
            style={[
              styles.actionButton,
              { backgroundColor: action.color },
            ]}
          >
            <IconButton
              icon={action.icon}
              onPress={action.onPress}
              size="small"
              variant="filled"
              color={action.color}
            />
            {action.label && (
              <Text style={[styles.actionLabel, theme.typography.labelSmall]}>
                {action.label}
              </Text>
            )}
          </View>
        ))}
      </Animated.View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={leftActions.length > 0 ? renderLeftActions : undefined}
      renderRightActions={
        rightActions.length > 0 || onDelete ? renderRightActions : undefined
      }
      overshootLeft={false}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionLabel: {
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '600',
  },
});

export default SwipeableCard;
