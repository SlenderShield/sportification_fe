import React from 'react';
import { FormScreenTemplate } from '@shared/components/templates';
import { useEditProfileScreen } from '../hooks';

const EditProfileScreen: React.FC<any> = ({ navigation }) => {
  const props = useEditProfileScreen(navigation);
  
  return (
    <FormScreenTemplate
      title="Edit Profile"
      fields={props.formFields}
      onSubmit={props.handleSubmit}
      onCancel={() => navigation.goBack()}
      isLoading={props.isSubmitting}
    />
  );
};

export default EditProfileScreen;
