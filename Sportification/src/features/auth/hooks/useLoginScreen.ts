import { useState, useCallback } from 'react';
import { useForm } from '@shared/hooks';
import { authService } from '../services';

export function useLoginScreen(navigation: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, handleChange, validate } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
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
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await authService.login(values.email, values.password);
      // Navigation will be handled by auth state change
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  const handleRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  return {
    values,
    errors,
    error,
    isSubmitting,
    onChange: handleChange,
    onSubmit: handleSubmit,
    onRegister: handleRegister,
    onForgotPassword: handleForgotPassword,
  };
}
