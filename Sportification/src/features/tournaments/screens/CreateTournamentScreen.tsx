import React from 'react';
import { FormScreenTemplate } from '@shared/components/templates';
import { useCreateTournamentScreen } from '../hooks';

const CreateTournamentScreen: React.FC<any> = ({ navigation }) => {
  const props = useCreateTournamentScreen(navigation);
  
  return (
    <FormScreenTemplate
      title="Create Tournament"
      fields={props.formFields}
      onSubmit={props.handleSubmit}
      onCancel={() => navigation.goBack()}
      isLoading={props.isSubmitting}
    />
  );
};

export default CreateTournamentScreen;
