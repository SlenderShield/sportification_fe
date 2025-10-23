import { useState, useCallback } from 'react';
import { useForm } from '@shared/hooks';
import { useGetCurrentUserQuery } from '../store/paymentApi';

export function useEditProfileScreen(navigation: any) {
  const { data } = useGetCurrentUserQuery();
  const user = data?.data;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, handleChange, validate } = useForm({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      bio: user?.bio || '',
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
    },
  });

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call update profile API
      // await profileService.updateProfile(values);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
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
