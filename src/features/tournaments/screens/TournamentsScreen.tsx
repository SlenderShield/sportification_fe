import React from 'react';
import { ListScreenTemplate } from '@shared/components/templates';
import { useTournamentsScreen } from '../hooks';
import { Card } from '@shared/components/organisms';

const TournamentsScreen: React.FC<any> = ({ navigation }) => {
  const props = useTournamentsScreen(navigation);
  
  return (
    <ListScreenTemplate
      title="Tournaments"
      items={props.tournaments}
      renderItem={(tournament) => <Card>{tournament.name}</Card>}
      isLoading={props.isLoading}
      onRefresh={props.onRefresh}
      onAddNew={props.onCreateTournament}
      emptyMessage="No tournaments found"
    />
  );
};

export default TournamentsScreen;
