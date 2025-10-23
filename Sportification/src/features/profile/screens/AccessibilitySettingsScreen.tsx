import React from 'react';
import { FormScreenTemplate } from '@shared/components/templates';

const AccessibilitySettingsScreen: React.FC<any> = ({ navigation }) => {
  return (
    <FormScreenTemplate
      title="Accessibility Settings"
      fields={[]}
      onSubmit={() => {}}
      onCancel={() => navigation.goBack()}
      isLoading={false}
    />
  );
};

export default AccessibilitySettingsScreen;
