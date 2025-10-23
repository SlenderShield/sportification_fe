import { useState, useCallback } from 'react';
import { useForm } from '@shared/hooks';
import { venueService } from '../services';

export function useCreateBookingScreen(route: any, navigation: any) {
  const { venueId } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, handleChange, validate } = useForm({
    initialValues: {
      venueId,
      date: new Date(),
      startTime: '',
      endTime: '',
      sport: '',
    },
    validationRules: {
      startTime: (value) => {
        if (!value) {
          return 'Start time is required';
        }
        return null;
      },
      endTime: (value) => {
        if (!value) {
          return 'End time is required';
        }
        return null;
      },
      sport: (value) => {
        if (!value) {
          return 'Sport is required';
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
      await venueService.bookVenue(venueId, values);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  }, [venueId, values, validate, navigation]);

  return {
    values,
    errors,
    error,
    isSubmitting,
    onChange: handleChange,
    onSubmit: handleSubmit,
  };
}
