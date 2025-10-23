/**
 * SportSelector Component
 * Reusable sport selection interface with chips
 * Used in Create Match, Team, and Tournament screens
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chip } from './';
import { useTheme } from '../../theme';
import { SPORTS } from '@core/constants';

interface SportSelectorProps {
  selectedSport: string;
  onSelect: (sport: string) => void;
  error?: string;
}

const SportSelector: React.FC<SportSelectorProps> = ({ selectedSport, onSelect, error }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.chipContainer}>
        {SPORTS.map((sport) => (
          <Chip
            key={sport.name}
            label={sport.name}
            icon={sport.icon}
            selected={selectedSport === sport.name}
            onPress={() => onSelect(sport.name)}
            variant={selectedSport === sport.name ? 'filled' : 'outlined'}
            style={styles.chip}
          />
        ))}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default SportSelector;
