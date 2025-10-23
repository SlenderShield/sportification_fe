/**
 * Sort and Filter Component
 * Advanced sorting and filtering UI with bottom sheet
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../theme';
import { BottomSheet, Chip } from '../ui';
import Button from '../common/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerLightImpact, triggerSelection } from '../../utils/hapticFeedback';

export interface SortOption {
  id: string;
  label: string;
  field: string;
  direction?: 'asc' | 'desc';
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  category?: string;
}

interface SortFilterProps {
  // Sort options
  sortOptions?: SortOption[];
  selectedSort?: string;
  onSortChange?: (sortId: string) => void;

  // Filter options
  filterCategories?: {
    id: string;
    label: string;
    options: FilterOption[];
    multiSelect?: boolean;
  }[];
  selectedFilters?: string[];
  onFiltersChange?: (filterIds: string[]) => void;

  // Control
  visible: boolean;
  onClose: () => void;
  onApply?: () => void;
  onReset?: () => void;
}

const SortFilter: React.FC<SortFilterProps> = ({
  sortOptions = [],
  selectedSort,
  onSortChange,
  filterCategories = [],
  selectedFilters = [],
  onFiltersChange,
  visible,
  onClose,
  onApply,
  onReset,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'sort' | 'filter'>('sort');
  const [tempSelectedFilters, setTempSelectedFilters] = useState(selectedFilters);
  const [tempSelectedSort, setTempSelectedSort] = useState(selectedSort);

  const handleSortSelect = (sortId: string) => {
    setTempSelectedSort(sortId);
    triggerSelection();
  };

  const handleFilterToggle = (filterId: string, category: any) => {
    if (category.multiSelect) {
      // Multi-select: toggle filter
      const newFilters = tempSelectedFilters.includes(filterId)
        ? tempSelectedFilters.filter(f => f !== filterId)
        : [...tempSelectedFilters, filterId];
      setTempSelectedFilters(newFilters);
    } else {
      // Single select: replace filters in this category
      const categoryFilterIds = category.options.map((o: FilterOption) => o.id);
      const newFilters = [
        ...tempSelectedFilters.filter(f => !categoryFilterIds.includes(f)),
        filterId,
      ];
      setTempSelectedFilters(newFilters);
    }
    triggerSelection();
  };

  const handleApply = () => {
    if (onSortChange && tempSelectedSort !== selectedSort) {
      onSortChange(tempSelectedSort || '');
    }
    if (onFiltersChange) {
      onFiltersChange(tempSelectedFilters);
    }
    if (onApply) {
      onApply();
    }
    triggerLightImpact();
    onClose();
  };

  const handleReset = () => {
    setTempSelectedSort(undefined);
    setTempSelectedFilters([]);
    if (onSortChange) {
      onSortChange('');
    }
    if (onFiltersChange) {
      onFiltersChange([]);
    }
    if (onReset) {
      onReset();
    }
    triggerLightImpact();
  };

  const handleClose = () => {
    // Reset temp state to current state
    setTempSelectedSort(selectedSort);
    setTempSelectedFilters(selectedFilters);
    onClose();
  };

  const hasChanges = 
    tempSelectedSort !== selectedSort ||
    JSON.stringify(tempSelectedFilters.sort()) !== JSON.stringify(selectedFilters.sort());

  const hasActiveFilters = tempSelectedFilters.length > 0 || tempSelectedSort;

  return (
    <BottomSheet visible={visible} onClose={handleClose} height={0.75}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[theme.typography.titleLarge, { color: theme.colors.text }]}>
            Sort & Filter
          </Text>
          <Pressable
            onPress={handleClose}
            accessibilityLabel="Close sort and filter"
            accessibilityRole="button"
          >
            <Icon name="close" size={24} color={theme.colors.text} />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            onPress={() => {
              setActiveTab('sort');
              triggerLightImpact();
            }}
            style={[
              styles.tab,
              activeTab === 'sort' && {
                borderBottomWidth: 2,
                borderBottomColor: theme.colors.primary,
              },
            ]}
            accessibilityLabel="Sort tab"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'sort' }}
          >
            <Text
              style={[
                theme.typography.labelLarge,
                {
                  color: activeTab === 'sort' ? theme.colors.primary : theme.colors.textSecondary,
                  fontWeight: activeTab === 'sort' ? '600' : '400',
                },
              ]}
            >
              Sort
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setActiveTab('filter');
              triggerLightImpact();
            }}
            style={[
              styles.tab,
              activeTab === 'filter' && {
                borderBottomWidth: 2,
                borderBottomColor: theme.colors.primary,
              },
            ]}
            accessibilityLabel="Filter tab"
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'filter' }}
          >
            <Text
              style={[
                theme.typography.labelLarge,
                {
                  color: activeTab === 'filter' ? theme.colors.primary : theme.colors.textSecondary,
                  fontWeight: activeTab === 'filter' ? '600' : '400',
                },
              ]}
            >
              Filter
              {tempSelectedFilters.length > 0 && ` (${tempSelectedFilters.length})`}
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'sort' && (
            <View style={styles.section}>
              {sortOptions.map(option => (
                <Pressable
                  key={option.id}
                  onPress={() => handleSortSelect(option.id)}
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor:
                        tempSelectedSort === option.id
                          ? theme.colors.primaryContainer
                          : 'transparent',
                      borderRadius: theme.borderRadius.sm,
                    },
                  ]}
                  accessibilityLabel={`Sort by ${option.label}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: tempSelectedSort === option.id }}
                >
                  <Text
                    style={[
                      theme.typography.bodyLarge,
                      {
                        color:
                          tempSelectedSort === option.id
                            ? theme.colors.onPrimaryContainer
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {tempSelectedSort === option.id && (
                    <Icon
                      name="check"
                      size={20}
                      color={theme.colors.onPrimaryContainer}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {activeTab === 'filter' && (
            <View>
              {filterCategories.map(category => (
                <View key={category.id} style={styles.filterCategory}>
                  <Text
                    style={[
                      theme.typography.titleSmall,
                      { color: theme.colors.text, marginBottom: theme.spacing.md },
                    ]}
                  >
                    {category.label}
                  </Text>
                  <View style={styles.filterOptions}>
                    {category.options.map(option => (
                      <Chip
                        key={option.id}
                        label={option.label}
                        selected={tempSelectedFilters.includes(option.id)}
                        onPress={() => handleFilterToggle(option.id, category)}
                        style={{ marginRight: theme.spacing.sm, marginBottom: theme.spacing.sm }}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          {hasActiveFilters && (
            <Button
              title="Reset"
              onPress={handleReset}
              variant="outline"
              style={{ flex: 1, marginRight: theme.spacing.sm }}
              accessibilityLabel="Reset filters"
            />
          )}
          <Button
            title={hasChanges ? 'Apply' : 'Close'}
            onPress={hasChanges ? handleApply : handleClose}
            variant="primary"
            style={{ flex: 1 }}
            accessibilityLabel={hasChanges ? 'Apply filters' : 'Close'}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterCategory: {
    marginBottom: 24,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});

export default SortFilter;
