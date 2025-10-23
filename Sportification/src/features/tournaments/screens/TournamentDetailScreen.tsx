import React from 'react';
import { View } from 'react-native';
import { DetailScreenTemplate } from '@shared/components/templates';
import { useTournamentDetailScreen } from '../hooks';

const TournamentDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const props = useTournamentDetailScreen(route, navigation);
  
  if (!props.tournament) return null;

  return (
    <DetailScreenTemplate
      title={props.tournament.name}
      subtitle={props.tournament.description}
      isLoading={props.isLoading}
      primaryAction={{ label: 'Join', onPress: props.onJoinTournament }}
    >
      <View />
    </DetailScreenTemplate>
  );
};

export default TournamentDetailScreen;
