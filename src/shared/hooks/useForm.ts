/**
 * useForm Hook
 * Comprehensive form management hook with validation
 * Reduces boilerplate in create/edit screens
 */

import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FieldConfig {
  [key: string]: ValidationRule;
}

export interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: FieldConfig;
  onSubmit: (values: T) => Promise<void> | void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: () => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (field: keyof T): boolean => {
      const value = values[field];
      const rules = validationRules[field as string];

      if (!rules) return true;

      // Required validation
      if (rules.required && (!value || value === '')) {
        setErrors((prev) => ({
          ...prev,
          [field]: `${String(field)} is required`,
        }));
        return false;
      }

      // Min length validation (for strings)
      if (
        rules.minLength &&
        typeof value === 'string' &&
        value.length < rules.minLength
      ) {
        setErrors((prev) => ({
          ...prev,
          [field]: `${String(field)} must be at least ${rules.minLength} characters`,
        }));
        return false;
      }

      // Max length validation (for strings)
      if (
        rules.maxLength &&
        typeof value === 'string' &&
        value.length > rules.maxLength
      ) {
        setErrors((prev) => ({
          ...prev,
          [field]: `${String(field)} must be at most ${rules.maxLength} characters`,
        }));
        return false;
      }

      // Min value validation (for numbers)
      if (rules.min !== undefined && Number(value) < rules.min) {
        setErrors((prev) => ({
          ...prev,
          [field]: `${String(field)} must be at least ${rules.min}`,
        }));
        return false;
      }

      // Max value validation (for numbers)
      if (rules.max !== undefined && Number(value) > rules.max) {
        setErrors((prev) => ({
          ...prev,
          [field]: `${String(field)} must be at most ${rules.max}`,
        }));
        return false;
      }

      // Pattern validation (for strings)
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [field]: `${String(field)} format is invalid`,
        }));
        return false;
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          setErrors((prev) => ({
            ...prev,
            [field]: customError,
          }));
          return false;
        }
      }

      // Clear error if validation passed
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });

      return true;
    },
    [values, validationRules]
  );

  const validateForm = useCallback((): boolean => {
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const fieldValid = validateField(field as keyof T);
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  }, [validationRules, validateField]);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    
    // Validate on change if field has been touched
    if (touched[field as string]) {
      setTimeout(() => {
        validateField(field);
      }, 0);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  }, [validateField]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(initialValues).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate all fields
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      // Error handling can be done by the consumer
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateField,
    validateForm,
  };
}
