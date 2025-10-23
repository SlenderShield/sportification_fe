/**
 * Common validation utilities
 * Reusable validation functions to ensure consistency across forms
 */

export interface ValidationResult {
  isValid: boolean;
  error: string;
}

/**
 * Validates a name field (team, tournament, match title, etc.)
 */
export const validateName = (name: string, fieldName: string = 'Name', minLength: number = 3): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validates a date field in YYYY-MM-DD format
 */
export const validateDate = (date: string, fieldName: string = 'Date'): ValidationResult => {
  if (!date.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { isValid: false, error: `${fieldName} must be in YYYY-MM-DD format` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validates a time field in HH:MM format
 */
export const validateTime = (time: string, fieldName: string = 'Time'): ValidationResult => {
  if (!time.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(time)) {
    return { isValid: false, error: `${fieldName} must be in HH:MM format (24h)` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validates a number within a range
 */
export const validateNumber = (
  value: string,
  fieldName: string,
  min?: number,
  max?: number,
  required: boolean = true
): ValidationResult => {
  if (!value.trim()) {
    if (required) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true, error: '' };
  }

  const num = parseInt(value, 10);
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max}` };
  }

  return { isValid: true, error: '' };
};

/**
 * Validates a required selection (sport, format, etc.)
 */
export const validateSelection = (value: string, fieldName: string = 'Selection'): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: '' };
};
