import { useState, useCallback } from 'react';
import { useForm } from '@shared/hooks';
import { teamService } from '../services';

export function useCreateTeamScreen(navigation: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, handleChange, validate } = useForm({
    initialValues: {
      name: '',
      sport: '',
      description: '',
      maxMembers: 20,
    },
    validationRules: {
      name: (value) => {
        if (!value || value.length < 3) {
          return 'Team name must be at least 3 characters';
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
      await teamService.createTeam(values);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
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
