/**
 * Form helper functions for validation and submission
 */

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Validate required field
 */
export const required = (message: string = 'This field is required'): ValidationRule => ({
  validate: (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  },
  message,
});

/**
 * Validate minimum length
 */
export const minLength = (length: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    return String(value).length >= length;
  },
  message: message || `Minimum length is ${length} characters`,
});

/**
 * Validate maximum length
 */
export const maxLength = (length: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    return String(value).length <= length;
  },
  message: message || `Maximum length is ${length} characters`,
});

/**
 * Validate email format
 */
export const email = (message: string = 'Invalid email address'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(value));
  },
  message,
});

/**
 * Validate phone number
 */
export const phone = (message: string = 'Invalid phone number'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    const phoneRegex = /^[\d\s\-+()]+$/;
    return phoneRegex.test(String(value));
  },
  message,
});

/**
 * Validate URL
 */
export const url = (message: string = 'Invalid URL'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    try {
      // Validate URL by attempting to parse it
      const urlObj = new URL(String(value));
      return !!urlObj;
    } catch {
      return false;
    }
  },
  message,
});

/**
 * Validate numeric value
 */
export const numeric = (message: string = 'Must be a number'): ValidationRule => ({
  validate: (value) => {
    if (!value && value !== 0) return true;
    return !isNaN(Number(value));
  },
  message,
});

/**
 * Validate minimum value
 */
export const min = (minValue: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value && value !== 0) return true;
    return Number(value) >= minValue;
  },
  message: message || `Minimum value is ${minValue}`,
});

/**
 * Validate maximum value
 */
export const max = (maxValue: number, message?: string): ValidationRule => ({
  validate: (value) => {
    if (!value && value !== 0) return true;
    return Number(value) <= maxValue;
  },
  message: message || `Maximum value is ${maxValue}`,
});

/**
 * Validate pattern (regex)
 */
export const pattern = (regex: RegExp, message: string = 'Invalid format'): ValidationRule => ({
  validate: (value) => {
    if (!value) return true;
    return regex.test(String(value));
  },
  message,
});

/**
 * Validate field matches another field
 */
export const matches = (otherField: string, otherValue: any, message: string = 'Fields do not match'): ValidationRule => ({
  validate: (value) => {
    return value === otherValue;
  },
  message,
});

/**
 * Validate field with custom function
 */
export const custom = (validateFn: (value: any) => boolean, message: string): ValidationRule => ({
  validate: validateFn,
  message,
});

/**
 * Validate a single field with multiple rules
 */
export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
};

/**
 * Validate entire form
 */
export const validateForm = (
  formData: Record<string, any>,
  rules: Record<string, ValidationRule[]>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    const error = validateField(value, fieldRules);
    
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};

/**
 * Get first error message from errors object
 */
export const getFirstError = (errors: Record<string, string>): string | null => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};

/**
 * Sanitize form data (trim strings, remove empty values)
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T, removeEmpty: boolean = false): T => {
  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
      
      if (removeEmpty && sanitized[key] === '') {
        delete sanitized[key];
      }
    } else if (removeEmpty && (value === null || value === undefined || value === '')) {
      delete sanitized[key];
    }
  });
  
  return sanitized;
};

/**
 * Build form data for multipart/form-data submission
 */
export const buildFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, value);
      }
    }
  });
  
  return formData;
};

/**
 * Convert form data to query string
 */
export const toQueryString = (data: Record<string, any>): string => {
  const params = new URLSearchParams();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => {
          params.append(key, String(item));
        });
      } else {
        params.append(key, String(value));
      }
    }
  });
  
  return params.toString();
};

/**
 * Reset form data to initial values
 */
export const resetForm = <T extends Record<string, any>>(initialValues: T): T => {
  return { ...initialValues };
};

/**
 * Handle form submission with validation
 */
export const handleFormSubmit = async <T extends Record<string, any>>(
  formData: T,
  rules: Record<string, ValidationRule[]>,
  onSubmit: (data: T) => Promise<void>,
  onError?: (errors: Record<string, string>) => void
): Promise<boolean> => {
  const errors = validateForm(formData, rules);
  
  if (hasErrors(errors)) {
    onError?.(errors);
    return false;
  }
  
  try {
    const sanitized = sanitizeFormData(formData);
    await onSubmit(sanitized);
    return true;
  } catch (error) {
    console.error('Form submission error:', error);
    return false;
  }
};

/**
 * Debounce validation
 */
export const debounceValidation = (
  validate: () => void,
  delay: number = 300
): (() => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(validate, delay);
  };
};
