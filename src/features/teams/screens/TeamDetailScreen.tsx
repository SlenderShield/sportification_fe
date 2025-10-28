import React from 'react';
import { View } from 'react-native';
import { DetailScreenTemplate } from '@shared/components/templates';
import { useTeamDetailScreen } from '../hooks';
import { DetailRow } from '@shared/components/molecules';

interface TeamDetailScreenProps {
  navigation: any;
  route: any;
}

const TeamDetailScreen: React.FC<TeamDetailScreenProps> = ({ navigation, route }) => {
  const props = useTeamDetailScreen(route, navigation);
  
  if (!props.team) {
    return null;
  }

  return (
    <DetailScreenTemplate
      title={props.team.name}
      subtitle={props.team.description}
      isLoading={props.isLoading}
      error={props.error}
      primaryAction={{ label: 'Join Team', onPress: props.onJoinTeam }}
      secondaryAction={{ label: 'Leave Team', onPress: props.onLeaveTeam }}
    >
      <View>
        <DetailRow label="Sport" value={props.team.sport} />
        <DetailRow label="Members" value={`${props.team.members?.length || 0}`} />
      </View>
    </DetailScreenTemplate>
  );
};

export default TeamDetailScreen;
