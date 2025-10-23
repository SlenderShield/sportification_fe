/**
 * EmptyState Component
 * Reusable empty state component with icon and message
 * Used across list screens when no data is available
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme';

interface EmptyStateProps {
  icon: string;
  title: string;
  message?: string;
  iconSize?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  message, 
  iconSize = 64 
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Icon 
        name={icon} 
        size={iconSize} 
        color={theme.colors.textSecondary} 
        style={styles.icon}
      />
      <Text style={[styles.title, theme.typography.titleLarge, { color: theme.colors.text }]}>
        {title}
      </Text>
      {message && (
        <Text style={[styles.message, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;
