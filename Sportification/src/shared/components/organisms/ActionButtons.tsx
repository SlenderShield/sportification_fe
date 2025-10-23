/**
 * ActionButtons Component
 * Standardized action button group with consistent spacing and layout
 * Handles common patterns like loading states and conditional rendering
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Button from '../common/Button';
import { useTheme } from '../../theme';

export interface ActionButton {
  title: string;
  icon?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  loading?: boolean;
  disabled?: boolean;
  visible?: boolean;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  orientation?: 'vertical' | 'horizontal';
  animated?: boolean;
  animationDelay?: number;
  fullWidth?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  orientation = 'vertical',
  animated = true,
  animationDelay = 500,
  fullWidth = true,
}) => {
  const { theme } = useTheme();

  const visibleButtons = buttons.filter((btn) => btn.visible !== false);

  if (visibleButtons.length === 0) return null;

  const buttonElements = visibleButtons.map((button, index) => (
    <Button
      key={index}
      title={button.title}
      icon={button.icon}
      onPress={button.onPress}
      variant={button.variant || 'primary'}
      loading={button.loading}
      disabled={button.disabled}
      fullWidth={orientation === 'vertical' && fullWidth}
      style={
        orientation === 'vertical'
          ? { marginBottom: index < visibleButtons.length - 1 ? theme.spacing.sm : 0 }
          : { marginRight: index < visibleButtons.length - 1 ? theme.spacing.sm : 0 }
      }
    />
  ));

  const content = (
    <View
      style={[
        styles.container,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
      ]}
    >
      {buttonElements}
    </View>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeInDown.delay(animationDelay).springify()}>
        {content}
      </Animated.View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  vertical: {
    flexDirection: 'column',
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default ActionButtons;
