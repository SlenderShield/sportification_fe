import React from 'react';
import { FormScreenTemplate } from '@shared/components/templates';
import { useChangePasswordScreen } from '../hooks';

const ChangePasswordScreen: React.FC<any> = ({ navigation }) => {
  const props = useChangePasswordScreen(navigation);
  
  return (
    <FormScreenTemplate
      title="Change Password"
      fields={props.formFields}
      onSubmit={props.handleSubmit}
      onCancel={() => navigation.goBack()}
      isLoading={props.isSubmitting}
    />
  );
};

export default ChangePasswordScreen;
