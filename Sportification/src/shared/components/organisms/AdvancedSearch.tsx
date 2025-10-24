/**
 * Advanced Search Component
 * Enhanced search with history, suggestions, and filters
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useTheme } from '../../theme';
import { Card, IconButton } from '../ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { triggerLightImpact, triggerSelection } from '@shared/utils/hapticFeedback';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'history' | 'suggestion';
}

interface AdvancedSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  storageKey?: string; // Key for storing search history
  maxHistory?: number;
  showHistory?: boolean;
  showSuggestions?: boolean;
}

const HISTORY_STORAGE_PREFIX = '@search_history_';
const DEFAULT_MAX_HISTORY = 10;

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  storageKey = 'default',
  maxHistory = DEFAULT_MAX_HISTORY,
  showHistory = true,
  showSuggestions = true,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadSearchHistory();
    // loadSearchHistory is defined in component scope and uses storageKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const loadSearchHistory = async () => {
    if (!showHistory) return;
    
    try {
      const historyKey = `${HISTORY_STORAGE_PREFIX}${storageKey}`;
      const historyData = await AsyncStorage.getItem(historyKey);
      if (historyData) {
        setSearchHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const saveSearchHistory = async (query: string) => {
    if (!showHistory || !query.trim()) return;

    try {
      const historyKey = `${HISTORY_STORAGE_PREFIX}${storageKey}`;
      const newHistory = [
        query,
        ...searchHistory.filter(item => item !== query),
      ].slice(0, maxHistory);

      await AsyncStorage.setItem(historyKey, JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

  const clearSearchHistory = async () => {
    try {
      const historyKey = `${HISTORY_STORAGE_PREFIX}${storageKey}`;
      await AsyncStorage.removeItem(historyKey);
      setSearchHistory([]);
      triggerSelection();
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  };

  const removeHistoryItem = async (item: string) => {
    try {
      const historyKey = `${HISTORY_STORAGE_PREFIX}${storageKey}`;
      const newHistory = searchHistory.filter(h => h !== item);
      await AsyncStorage.setItem(historyKey, JSON.stringify(newHistory));
      setSearchHistory(newHistory);
      triggerLightImpact();
    } catch (error) {
      console.error('Failed to remove history item:', error);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      saveSearchHistory(query);
      onSearch(query);
      setShowDropdown(false);
      triggerSelection();
    }
  };

  const handleSuggestionSelect = (text: string) => {
    onChangeText(text);
    handleSearch(text);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow click events on suggestions
    setTimeout(() => setShowDropdown(false), 200);
  };

  const getDisplayItems = (): SearchSuggestion[] => {
    const items: SearchSuggestion[] = [];

    // Add search history if available and no current query
    if (showHistory && searchHistory.length > 0 && !value.trim()) {
      items.push(
        ...searchHistory.map(text => ({
          id: `history_${text}`,
          text,
          type: 'history' as const,
        }))
      );
    }

    // Add suggestions based on current query
    if (showSuggestions && value.trim() && suggestions.length > 0) {
      items.push(
        ...suggestions
          .filter(s => s.text.toLowerCase().includes(value.toLowerCase()))
          .map(s => ({ ...s, type: 'suggestion' as const }))
      );
    }

    return items;
  };

  const displayItems = getDisplayItems();

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: theme.borderRadius.md,
            borderWidth: isFocused ? 2 : 0,
            borderColor: isFocused ? theme.colors.primary : 'transparent',
          },
        ]}
      >
        <Icon
          name="magnify"
          size={24}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={() => handleSearch(value)}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          style={[
            theme.typography.bodyLarge,
            {
              flex: 1,
              color: theme.colors.text,
              paddingVertical: 12,
            },
          ]}
          returnKeyType="search"
          accessible={true}
          accessibilityLabel="Search input"
          accessibilityHint="Enter search query"
        />
        {value.length > 0 && (
          <IconButton
            icon="close-circle"
            size="small"
            onPress={() => {
              onChangeText('');
              triggerLightImpact();
            }}
            variant="text"
            accessibilityLabel="Clear search"
          />
        )}
      </View>

      {/* Dropdown with History and Suggestions */}
      {showDropdown && displayItems.length > 0 && (
        <Card variant="elevated" style={[styles.dropdown, theme.elevation.md]}>
          {/* Header for history */}
          {showHistory && searchHistory.length > 0 && !value.trim() && (
            <View style={styles.dropdownHeader}>
              <Text
                style={[
                  theme.typography.labelMedium,
                  { color: theme.colors.textSecondary, fontWeight: '600' },
                ]}
              >
                Recent Searches
              </Text>
              <Pressable
                onPress={clearSearchHistory}
                accessibilityLabel="Clear search history"
                accessibilityRole="button"
              >
                <Text
                  style={[
                    theme.typography.labelMedium,
                    { color: theme.colors.primary, fontWeight: '600' },
                  ]}
                >
                  Clear All
                </Text>
              </Pressable>
            </View>
          )}

          {/* Items List */}
          <FlatList
            data={displayItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSuggestionSelect(item.text)}
                style={[
                  styles.dropdownItem,
                  {
                    backgroundColor: theme.colors.surface,
                  },
                ]}
                accessibilityLabel={`Search for ${item.text}`}
                accessibilityRole="button"
              >
                <Icon
                  name={item.type === 'history' ? 'history' : 'magnify'}
                  size={20}
                  color={theme.colors.textSecondary}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={[
                    theme.typography.bodyMedium,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                  numberOfLines={1}
                >
                  {item.text}
                </Text>
                {item.type === 'history' && (
                  <Pressable
                    onPress={() => removeHistoryItem(item.text)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel={`Remove ${item.text} from history`}
                    accessibilityRole="button"
                  >
                    <Icon name="close" size={20} color={theme.colors.textSecondary} />
                  </Pressable>
                )}
              </Pressable>
            )}
            scrollEnabled={false}
            maxToRenderPerBatch={10}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,
    maxHeight: 300,
    zIndex: 1001,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default AdvancedSearch;
