import { useState, useCallback } from 'react';
import { useForm } from '@shared/hooks';
import { authService } from '@features/auth/services';

export function useChangePasswordScreen(navigation: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, handleChange, validate } = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationRules: {
      currentPassword: (value) => {
        if (!value) {
          return 'Current password is required';
        }
        return null;
      },
      newPassword: (value) => {
        if (!value || value.length < 6) {
          return 'New password must be at least 6 characters';
        }
        return null;
      },
      confirmPassword: (value, allValues) => {
        if (value !== allValues.newPassword) {
          return 'Passwords do not match';
        }
        return null;
      },
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // await authService.changePassword(values.currentPassword, values.newPassword);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, navigation]);

  return {
    values,
    errors,
    error,
    isSubmitting,
    onChange: handleChange,
    onSubmit: handleSubmit,
  };
}
