/**
 * TimePicker Component
 * Enhanced time picker with better UX
 * Wrapper around Input with time formatting and validation
 */

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Input from '../common/Input';
import { useTheme } from '../../theme';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  format24h?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label = 'Time',
  placeholder = 'HH:MM',
  error,
  format24h = true,
  disabled = false,
  required = false,
}) => {
  const { theme } = useTheme();
  const [localError, setLocalError] = useState<string>('');

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    
    // Remove all non-numeric characters
    const cleaned = timeString.replace(/\D/g, '');
    
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return cleaned;
    
    // Format as HH:MM
    const hours = cleaned.substring(0, 2);
    const minutes = cleaned.substring(2, 4);
    
    return `${hours}:${minutes}`;
  };

  const validateTime = (timeString: string): boolean => {
    if (!timeString && !required) {
      setLocalError('');
      return true;
    }

    if (!timeString && required) {
      setLocalError('Time is required');
      return false;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    
    if (!timeRegex.test(timeString)) {
      setLocalError('Invalid time format (use HH:MM)');
      return false;
    }

    const [hours, minutes] = timeString.split(':').map(Number);

    if (format24h) {
      if (hours < 0 || hours > 23) {
        setLocalError('Hours must be between 00 and 23');
        return false;
      }
    } else {
      if (hours < 1 || hours > 12) {
        setLocalError('Hours must be between 01 and 12');
        return false;
      }
    }

    if (minutes < 0 || minutes > 59) {
      setLocalError('Minutes must be between 00 and 59');
      return false;
    }

    setLocalError('');
    return true;
  };

  const handleChange = (text: string) => {
    // Auto-format as user types
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length === 0) {
      onChange('');
      return;
    }

    if (cleaned.length <= 2) {
      onChange(cleaned);
      return;
    }

    // Auto-add colon after hours
    const hours = cleaned.substring(0, 2);
    const minutes = cleaned.substring(2, 4);
    onChange(`${hours}:${minutes}`);
  };

  const handleBlur = () => {
    if (value) {
      const formatted = formatTime(value);
      if (formatted !== value) {
        onChange(formatted);
      }
      validateTime(formatted);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label={label}
        value={value}
        onChangeText={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        error={error || localError}
        leftIcon="clock-outline"
        keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
        disabled={disabled}
        maxLength={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export default TimePicker;
