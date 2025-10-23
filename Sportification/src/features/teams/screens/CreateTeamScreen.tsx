import React from 'react';
import { FormScreenTemplate } from '@shared/components/templates';
import { useCreateTeamScreen } from '../hooks';

interface CreateTeamScreenProps {
  navigation: any;
}

const CreateTeamScreen: React.FC<CreateTeamScreenProps> = ({ navigation }) => {
  const props = useCreateTeamScreen(navigation);
  
  return (
    <FormScreenTemplate
      title="Create Team"
      fields={props.formFields}
      onSubmit={props.handleSubmit}
      onCancel={() => navigation.goBack()}
      isLoading={props.isSubmitting}
      submitLabel="Create Team"
    />
  );
};

export default CreateTeamScreen;
