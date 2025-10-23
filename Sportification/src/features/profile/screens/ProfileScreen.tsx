import React from 'react';
import { View } from 'react-native';
import { DetailScreenTemplate } from '@shared/components/templates';
import { useProfileScreen } from '../hooks';

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const props = useProfileScreen(navigation);
  
  if (!props.user) return null;

  return (
    <DetailScreenTemplate
      title={props.user.name}
      subtitle={props.user.email}
      isLoading={props.isLoading}
      primaryAction={{ label: 'Edit Profile', onPress: props.onEditProfile }}
      secondaryAction={{ label: 'Settings', onPress: props.onSettings }}
    >
      <View />
    </DetailScreenTemplate>
  );
};

export default ProfileScreen;
