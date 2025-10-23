import React from 'react';
import { View } from 'react-native';
import { DetailScreenTemplate } from '@shared/components/templates';
import { useVenueDetailScreen } from '../hooks';

const VenueDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const props = useVenueDetailScreen(route, navigation);
  
  if (!props.venue) return null;

  return (
    <DetailScreenTemplate
      title={props.venue.name}
      subtitle={props.venue.address}
      isLoading={props.isLoading}
      primaryAction={{ label: 'Book', onPress: props.onBookVenue }}
    >
      <View />
    </DetailScreenTemplate>
  );
};

export default VenueDetailScreen;
