import React from 'react';
import { FormScreenTemplate } from '@shared/components/templates';
import { useCreateBookingScreen } from '../hooks';

const CreateBookingScreen: React.FC<any> = ({ navigation }) => {
  const props = useCreateBookingScreen(navigation);
  
  return (
    <FormScreenTemplate
      title="Create Booking"
      fields={props.formFields}
      onSubmit={props.handleSubmit}
      onCancel={() => navigation.goBack()}
      isLoading={props.isSubmitting}
    />
  );
};

export default CreateBookingScreen;
