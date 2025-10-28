import React from 'react';
import { ListScreenTemplate } from '@shared/components/templates';
import { useNotificationsScreen } from '../hooks';
import { NotificationCard } from '@shared/components/organisms';

const NotificationsScreen: React.FC<any> = ({ navigation }) => {
  const props = useNotificationsScreen(navigation);
  
  return (
    <ListScreenTemplate
      title="Notifications"
      items={props.notifications}
      renderItem={(notification) => <NotificationCard notification={notification} />}
      isLoading={props.isLoading}
      onRefresh={props.onRefresh}
      emptyMessage="No notifications"
    />
  );
};

export default NotificationsScreen;
