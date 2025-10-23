import React from 'react';
import { ListScreenTemplate } from '@shared/components/templates';
import { useSettingsScreen } from '../hooks';
import { Card } from '@shared/components/organisms';

const SettingsScreen: React.FC<any> = ({ navigation }) => {
  const props = useSettingsScreen(navigation);
  
  return (
    <ListScreenTemplate
      title="Settings"
      items={props.settings}
      renderItem={(setting) => <Card>{setting.label}</Card>}
      isLoading={props.isLoading}
      emptyMessage="No settings available"
    />
  );
};

export default SettingsScreen;
