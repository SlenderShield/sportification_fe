/**
 * DetailRow Component
 * Reusable row component for displaying labeled information with icons
 * Used in detail screens (Match, Team, Tournament, Venue)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme';

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  iconColor?: string;
  iconSize?: number;
}

const DetailRow: React.FC<DetailRowProps> = ({ 
  icon, 
  label, 
  value, 
  iconColor, 
  iconSize = 24 
}) => {
  const { theme } = useTheme();
  const color = iconColor || theme.colors.primary;

  return (
    <View style={styles.row}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={iconSize} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, theme.typography.bodyLarge, { color: theme.colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    fontWeight: '500',
  },
});

export default DetailRow;
