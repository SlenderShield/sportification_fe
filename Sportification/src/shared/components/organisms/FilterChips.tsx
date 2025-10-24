/**
 * FilterChips Component
 * Reusable filter chips for list filtering
 * Supports multiple selection and custom filters
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip } from './';

export interface FilterOption {
  id: string;
  label: string;
  icon?: string;
}

interface FilterChipsProps {
  options: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  multiSelect?: boolean;
  scrollable?: boolean;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selectedFilters,
  onFilterChange,
  scrollable = true,
}) => {

  const handlePress = (filterId: string) => {
    onFilterChange(filterId);
  };

  const isSelected = (filterId: string) => selectedFilters.includes(filterId);

  const chipContainer = (
    <View style={styles.chipContainer}>
      {options.map((option) => (
        <Chip
          key={option.id}
          label={option.label}
          icon={option.icon}
          selected={isSelected(option.id)}
          onPress={() => handlePress(option.id)}
          variant={isSelected(option.id) ? 'filled' : 'outlined'}
          style={styles.chip}
        />
      ))}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {chipContainer}
      </ScrollView>
    );
  }

  return chipContainer;
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default FilterChips;
