/**
 * SearchBar Component
 * Reusable search interface with optional cancel button
 * Used across screens for consistent search UX
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import { useTheme } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  leftIcon = 'magnify',
  showCancel = false,
  onCancel,
  onFocus,
  onBlur,
  autoFocus = false,
}) => {
  const { theme } = useTheme();

  const handleCancel = () => {
    onChangeText('');
    onCancel?.();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon={leftIcon}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        style={styles.input}
      />
      {showCancel && (
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="text"
          size="small"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
  },
});

export default SearchBar;
