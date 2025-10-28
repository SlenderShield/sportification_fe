import React from 'react';
import { ListScreenTemplate } from '@shared/components/templates';
import { useVenuesScreen } from '../hooks';
import { Card } from '@shared/components/organisms';

const VenuesScreen: React.FC<any> = ({ navigation }) => {
  const props = useVenuesScreen(navigation);
  
  return (
    <ListScreenTemplate
      title="Venues"
      items={props.venues}
      renderItem={(venue) => <Card>{venue.name}</Card>}
      isLoading={props.isLoading}
      onRefresh={props.onRefresh}
      onAddNew={props.onCreateBooking}
      emptyMessage="No venues found"
    />
  );
};

export default VenuesScreen;
