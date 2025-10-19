import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  useGetTeamQuery,
  useJoinTeamMutation,
  useLeaveTeamMutation,
  useDeleteTeamMutation,
} from '../../store/api/teamApi';
import { useAppSelector } from '../../store/hooks';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

interface TeamDetailScreenProps {
  navigation: any;
  route: any;
}

const TeamDetailScreen: React.FC<TeamDetailScreenProps> = ({ navigation, route }) => {
  const { teamId } = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetTeamQuery(teamId);
  const [joinTeam, { isLoading: isJoining }] = useJoinTeamMutation();
  const [leaveTeam, { isLoading: isLeaving }] = useLeaveTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const team = data?.data;

  const isMember = team?.members.some((m) => m.userId === user?.id);
  const isCaptain = team?.captain === user?.id;

  const handleJoin = async () => {
    try {
      await joinTeam(teamId).unwrap();
      Alert.alert('Success', 'You have joined the team!');
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to join team');
    }
  };

  const handleLeave = () => {
    Alert.alert(
      'Leave Team',
      'Are you sure you want to leave this team?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveTeam(teamId).unwrap();
              Alert.alert('Success', 'You have left the team');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to leave team');
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Team',
      'Are you sure you want to delete this team? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTeam(teamId).unwrap();
              Alert.alert('Success', 'Team deleted successfully');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to delete team');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!team) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Team not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {team.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{team.name}</Text>
        <Text style={styles.sport}>{team.sport}</Text>
        {team.description && (
          <Text style={styles.description}>{team.description}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Members ({team.members.length}{team.maxMembers ? ` / ${team.maxMembers}` : ''})
        </Text>
        {team.members.map((member) => (
          <View key={member.userId} style={styles.memberItem}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>
                {member.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.username}</Text>
              <Text style={styles.memberJoined}>
                Joined: {new Date(member.joinedAt).toLocaleDateString()}
              </Text>
            </View>
            {member.role === 'captain' && (
              <View style={styles.captainBadge}>
                <Text style={styles.captainText}>Captain</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        {!isMember && (
          <Button
            title="Join Team"
            onPress={handleJoin}
            loading={isJoining}
            disabled={team.maxMembers ? team.members.length >= team.maxMembers : false}
          />
        )}

        {isMember && !isCaptain && (
          <Button
            title="Leave Team"
            onPress={handleLeave}
            loading={isLeaving}
            variant="outline"
          />
        )}

        {isCaptain && (
          <>
            <Button
              title="Edit Team"
              onPress={() => navigation.navigate('EditTeam', { teamId })}
              style={styles.actionButton}
            />
            <Button
              title="Delete Team"
              onPress={handleDelete}
              loading={isDeleting}
              variant="outline"
              style={styles.actionButton}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5AC8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sport: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  memberJoined: {
    fontSize: 12,
    color: '#666',
  },
  captainBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  captainText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    padding: 16,
  },
  actionButton: {
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TeamDetailScreen;
