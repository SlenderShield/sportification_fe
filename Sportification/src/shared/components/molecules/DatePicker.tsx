/**
 * DatePicker Component
 * Enhanced date picker with better UX
 * Wrapper around Input with date formatting and validation
 */

import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Input from '../common/Input';
import { format, parse, isValid } from 'date-fns';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label = 'Date',
  placeholder = 'YYYY-MM-DD',
  error,
  minDate,
  maxDate,
  disabled = false,
  required = false,
}) => {
  const [localError, setLocalError] = useState<string>('');

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      if (isValid(date)) {
        return format(date, 'yyyy-MM-dd');
      }
    } catch (e) {
      // Invalid date
    }
    return dateString;
  };

  const validateDate = (dateString: string): boolean => {
    if (!dateString && !required) {
      setLocalError('');
      return true;
    }

    if (!dateString && required) {
      setLocalError('Date is required');
      return false;
    }

    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      
      if (!isValid(date)) {
        setLocalError('Invalid date format');
        return false;
      }

      if (minDate && date < minDate) {
        setLocalError(`Date must be after ${format(minDate, 'MMM dd, yyyy')}`);
        return false;
      }

      if (maxDate && date > maxDate) {
        setLocalError(`Date must be before ${format(maxDate, 'MMM dd, yyyy')}`);
        return false;
      }

      setLocalError('');
      return true;
    } catch (e) {
      setLocalError('Invalid date format');
      return false;
    }
  };

  const handleChange = (text: string) => {
    // Remove non-numeric and non-dash characters
    const cleaned = text.replace(/[^\d-]/g, '');
    onChange(cleaned);
  };

  const handleBlur = () => {
    if (value) {
      const formatted = formatDate(value);
      if (formatted !== value) {
        onChange(formatted);
      }
      validateDate(formatted);
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
        leftIcon="calendar"
        keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
        disabled={disabled}
        maxLength={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export default DatePicker;
