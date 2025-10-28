import { useState, useCallback } from 'react';
import { useForm } from '@shared/hooks';
import { tournamentService } from '../services';

export function useCreateTournamentScreen(navigation: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, handleChange, validate } = useForm({
    initialValues: {
      name: '',
      sport: '',
      format: 'single_elimination',
      startDate: new Date(),
      endDate: new Date(),
      maxTeams: 16,
      registrationDeadline: new Date(),
    },
    validationRules: {
      name: (value) => {
        if (!value || value.length < 3) {
          return 'Tournament name must be at least 3 characters';
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
      await tournamentService.createTournament(values);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to create tournament');
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
