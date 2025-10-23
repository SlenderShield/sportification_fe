import React from 'react';
import { ListScreenTemplate } from '@shared/components/templates';
import { useFriendsScreen } from '../hooks';
import { Card } from '@shared/components/organisms';

const FriendsScreen: React.FC<any> = ({ navigation }) => {
  const props = useFriendsScreen(navigation);
  
  return (
    <ListScreenTemplate
      title="Friends"
      items={props.friends}
      renderItem={(friend) => <Card>{friend.name}</Card>}
      isLoading={props.isLoading}
      onRefresh={props.onRefresh}
      emptyMessage="No friends yet"
    />
  );
};

export default FriendsScreen;
