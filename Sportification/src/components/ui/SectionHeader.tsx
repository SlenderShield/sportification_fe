/**
 * SectionHeader Component
 * Reusable section header with icon
 * Used in create and detail screens for organizing content
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme';

interface SectionHeaderProps {
  icon: string;
  title: string;
  iconColor?: string;
  iconSize?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  icon, 
  title, 
  iconColor, 
  iconSize = 20 
}) => {
  const { theme } = useTheme();
  const color = iconColor || theme.colors.primary;

  return (
    <View style={styles.container}>
      <Icon name={icon} size={iconSize} color={color} style={styles.icon} />
      <Text style={[styles.title, theme.typography.titleMedium, { color: theme.colors.text }]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontWeight: '600',
  },
});

export default SectionHeader;
