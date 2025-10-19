import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  useGetMatchQuery,
  useJoinMatchMutation,
  useLeaveMatchMutation,
  useDeleteMatchMutation,
  useUpdateStatusMutation,
} from '../../store/api/matchApi';
import { useAppSelector } from '../../store/hooks';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format } from 'date-fns';

interface MatchDetailScreenProps {
  navigation: any;
  route: any;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#007AFF',
  in_progress: '#FF9500',
  completed: '#34C759',
  cancelled: '#FF3B30',
};

const MatchDetailScreen: React.FC<MatchDetailScreenProps> = ({ navigation, route }) => {
  const { matchId } = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetMatchQuery(matchId);
  const [joinMatch, { isLoading: isJoining }] = useJoinMatchMutation();
  const [leaveMatch, { isLoading: isLeaving }] = useLeaveMatchMutation();
  const [deleteMatch, { isLoading: isDeleting }] = useDeleteMatchMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();

  const match = data?.data;

  const isParticipant = match?.participants.some((p) => p.userId === user?.id);
  const isOrganizer = match?.createdBy === user?.id;

  const handleJoin = async () => {
    try {
      await joinMatch(matchId).unwrap();
      Alert.alert('Success', 'You have joined the match!');
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to join match');
    }
  };

  const handleLeave = () => {
    Alert.alert(
      'Leave Match',
      'Are you sure you want to leave this match?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveMatch(matchId).unwrap();
              Alert.alert('Success', 'You have left the match');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to leave match');
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Match',
      'Are you sure you want to delete this match? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMatch(matchId).unwrap();
              Alert.alert('Success', 'Match deleted successfully');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to delete match');
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = (newStatus: string) => {
    Alert.alert(
      'Update Status',
      `Change match status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await updateStatus({ id: matchId, status: newStatus }).unwrap();
              Alert.alert('Success', 'Match status updated');
              refetch();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to update status');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!match) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Match not found</Text>
      </View>
    );
  }

  const matchDate = new Date(match.schedule.startTime);
  const isFull = match.maxParticipants ? match.participants.length >= match.maxParticipants : false;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[match.status] || '#999' }]}>
          <Text style={styles.statusText}>{match.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{match.title}</Text>
        <Text style={styles.sport}>{match.sport}</Text>
        {match.description && (
          <Text style={styles.description}>{match.description}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date & Time:</Text>
          <Text style={styles.detailValue}>
            {format(matchDate, 'MMM dd, yyyy • h:mm a')}
          </Text>
        </View>
        {match.venue && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Venue:</Text>
            <Text style={styles.detailValue}>{match.venue.name}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Participants:</Text>
          <Text style={styles.detailValue}>
            {match.participants.length}{match.maxParticipants ? ` / ${match.maxParticipants}` : ''}
          </Text>
        </View>
      </View>

      {match.score && match.status === 'completed' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Final Score</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{JSON.stringify(match.score)}</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Participants ({match.participants.length})
        </Text>
        {match.participants.map((participant, index) => (
          <View key={participant.userId} style={styles.participantItem}>
            <View style={styles.participantAvatar}>
              <Text style={styles.participantAvatarText}>
                {participant.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{participant.username}</Text>
              <Text style={styles.participantJoined}>
                Joined: {format(new Date(participant.joinedAt), 'MMM dd, yyyy')}
              </Text>
            </View>
            {participant.userId === match.createdBy && (
              <View style={styles.organizerBadge}>
                <Text style={styles.organizerText}>Organizer</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        {!isParticipant && match.status === 'scheduled' && (
          <Button
            title="Join Match"
            onPress={handleJoin}
            loading={isJoining}
            disabled={isFull}
          />
        )}

        {isParticipant && !isOrganizer && match.status === 'scheduled' && (
          <Button
            title="Leave Match"
            onPress={handleLeave}
            loading={isLeaving}
            variant="outline"
          />
        )}

        {isOrganizer && (
          <>
            {match.status === 'scheduled' && (
              <>
                <Button
                  title="Start Match"
                  onPress={() => handleStatusChange('in_progress')}
                  loading={isUpdating}
                  style={styles.actionButton}
                />
                <Button
                  title="Cancel Match"
                  onPress={() => handleStatusChange('cancelled')}
                  loading={isUpdating}
                  variant="outline"
                  style={styles.actionButton}
                />
              </>
            )}
            {match.status === 'in_progress' && (
              <Button
                title="Complete Match"
                onPress={() => handleStatusChange('completed')}
                loading={isUpdating}
                style={styles.actionButton}
              />
            )}
            <Button
              title="Delete Match"
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  scoreContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  participantAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  participantJoined: {
    fontSize: 12,
    color: '#666',
  },
  organizerBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  organizerText: {
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

export default MatchDetailScreen;
