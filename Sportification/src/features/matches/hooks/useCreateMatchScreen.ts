import { useState, useCallback } from 'react';
import { useForm } from '@shared/hooks';
import { matchService } from '../services';

export function useCreateMatchScreen(navigation: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, handleChange, validate } = useForm({
    initialValues: {
      title: '',
      sport: '',
      date: new Date(),
      time: '',
      location: '',
      maxParticipants: 10,
      description: '',
    },
    validationRules: {
      title: (value) => {
        if (!value || value.length < 3) {
          return 'Title must be at least 3 characters';
        }
        return null;
      },
      sport: (value) => {
        if (!value) {
          return 'Sport is required';
        }
        return null;
      },
      time: (value) => {
        if (!value) {
          return 'Time is required';
        }
        return null;
      },
      location: (value) => {
        if (!value) {
          return 'Location is required';
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
      await matchService.createMatch(values);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to create match');
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
