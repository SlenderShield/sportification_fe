/**
 * Accessibility Utilities
 * Helper functions for improving app accessibility
 */

/**
 * Generate accessible label for common UI patterns
 */
export const getAccessibleLabel = (
  componentType: string,
  value?: string,
  additionalInfo?: string
): string => {
  const parts = [value, componentType, additionalInfo].filter(Boolean);
  return parts.join(', ');
};

/**
 * Generate accessibility hint for interactive elements
 */
export const getAccessibilityHint = (
  action: 'tap' | 'double-tap' | 'swipe' | 'select' | 'toggle',
  result?: string
): string => {
  const actionMap = {
    tap: 'Tap to activate',
    'double-tap': 'Double tap to activate',
    swipe: 'Swipe to perform action',
    select: 'Tap to select',
    toggle: 'Tap to toggle',
  };

  const hint = actionMap[action];
  return result ? `${hint}. ${result}` : hint;
};

/**
 * Format value for screen readers
 */
export const formatValueForScreenReader = (
  value: string | number | boolean | undefined,
  unit?: string
): string => {
  if (value === undefined || value === null) {
    return 'Not set';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    const formattedNumber = value.toLocaleString();
    return unit ? `${formattedNumber} ${unit}` : formattedNumber;
  }

  return String(value);
};

/**
 * Create accessibility announcement for dynamic content changes
 */
export const createAccessibilityAnnouncement = (
  type: 'success' | 'error' | 'info' | 'warning',
  message: string
): string => {
  const prefix = {
    success: 'Success:',
    error: 'Error:',
    info: 'Information:',
    warning: 'Warning:',
  };

  return `${prefix[type]} ${message}`;
};

/**
 * Generate descriptive label for form fields
 */
export const getFormFieldLabel = (
  fieldName: string,
  isRequired: boolean = false,
  currentValue?: string
): string => {
  const parts = [fieldName];
  
  if (isRequired) {
    parts.push('required');
  }

  if (currentValue) {
    parts.push(`current value: ${currentValue}`);
  }

  return parts.join(', ');
};

/**
 * Common accessibility props for buttons
 */
export const getButtonAccessibilityProps = (
  label: string,
  action?: string,
  isDisabled: boolean = false,
  isLoading: boolean = false
) => ({
  accessible: true,
  accessibilityRole: 'button' as const,
  accessibilityLabel: label,
  accessibilityHint: action ? getAccessibilityHint('tap', action) : undefined,
  accessibilityState: {
    disabled: isDisabled,
    busy: isLoading,
  },
});

/**
 * Common accessibility props for toggles/switches
 */
export const getToggleAccessibilityProps = (
  label: string,
  isChecked: boolean,
  isDisabled: boolean = false
) => ({
  accessible: true,
  accessibilityRole: 'switch' as const,
  accessibilityLabel: label,
  accessibilityState: {
    checked: isChecked,
    disabled: isDisabled,
  },
  accessibilityHint: getAccessibilityHint('toggle'),
});

/**
 * Common accessibility props for text inputs
 */
export const getTextInputAccessibilityProps = (
  label: string,
  isRequired: boolean = false,
  hasError: boolean = false,
  errorMessage?: string
) => ({
  accessible: true,
  accessibilityLabel: getFormFieldLabel(label, isRequired),
  accessibilityHint: hasError && errorMessage ? errorMessage : undefined,
  accessibilityInvalid: hasError,
});
