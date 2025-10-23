import { useState, useCallback } from 'react';
import { useForm } from '@shared/hooks';
import { authService } from '../services';

export function useRegisterScreen(navigation: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, handleChange, validate } = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      username: (value) => {
        if (!value || value.length < 3) {
          return 'Username must be at least 3 characters';
        }
        return null;
      },
      email: (value) => {
        if (!value || !/\S+@\S+\.\S+/.test(value)) {
          return 'Valid email is required';
        }
        return null;
      },
      password: (value) => {
        if (!value || value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return null;
      },
      confirmPassword: (value, allValues) => {
        if (value !== allValues.password) {
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
      await authService.register(values.username, values.email, values.password);
      // Navigation will be handled by auth state change
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return {
    values,
    errors,
    error,
    isSubmitting,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onLogin: handleLogin,
  };
}
