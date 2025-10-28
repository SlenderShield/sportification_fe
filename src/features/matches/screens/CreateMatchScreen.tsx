import React from 'react';
import { FormScreenTemplate } from '@shared/components/templates';
import { useCreateMatchScreen } from '../hooks';

interface CreateMatchScreenProps {
  navigation: any;
}

const CreateMatchScreen: React.FC<CreateMatchScreenProps> = ({ navigation }) => {
  const props = useCreateMatchScreen(navigation);
  
  return (
    <FormScreenTemplate
      title="Create Match"
      fields={props.formFields}
      onSubmit={props.handleSubmit}
      onCancel={() => navigation.goBack()}
      isLoading={props.isSubmitting}
      submitLabel="Create Match"
    />
  );
};

export default CreateMatchScreen;
