import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  useGetTournamentQuery,
  useJoinTournamentMutation,
  useLeaveTournamentMutation,
  useDeleteTournamentMutation,
  useStartTournamentMutation,
} from '../../store/api/tournamentApi';
import { useAppSelector } from '../../store/hooks';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format } from 'date-fns';

interface TournamentDetailScreenProps {
  navigation: any;
  route: any;
}

const STATUS_COLORS: Record<string, string> = {
  upcoming: '#007AFF',
  registration: '#FF9500',
  in_progress: '#FFD700',
  completed: '#34C759',
  cancelled: '#FF3B30',
};

const TournamentDetailScreen: React.FC<TournamentDetailScreenProps> = ({ navigation, route }) => {
  const { tournamentId } = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetTournamentQuery(tournamentId);
  const [joinTournament, { isLoading: isJoining }] = useJoinTournamentMutation();
  const [leaveTournament, { isLoading: isLeaving }] = useLeaveTournamentMutation();
  const [deleteTournament, { isLoading: isDeleting }] = useDeleteTournamentMutation();
  const [startTournament, { isLoading: isStarting }] = useStartTournamentMutation();

  const tournament = data?.data;

  const isParticipant = tournament?.participants.some((p) => p.userId === user?.id);
  const isOrganizer = tournament?.createdBy === user?.id;

  const handleJoin = async () => {
    try {
      await joinTournament(tournamentId).unwrap();
      Alert.alert('Success', 'You have joined the tournament!');
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to join tournament');
    }
  };

  const handleLeave = () => {
    Alert.alert(
      'Leave Tournament',
      'Are you sure you want to leave this tournament?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveTournament(tournamentId).unwrap();
              Alert.alert('Success', 'You have left the tournament');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to leave tournament');
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Tournament',
      'Are you sure you want to delete this tournament? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTournament(tournamentId).unwrap();
              Alert.alert('Success', 'Tournament deleted successfully');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to delete tournament');
            }
          },
        },
      ]
    );
  };

  const handleStart = () => {
    Alert.alert(
      'Start Tournament',
      'Are you sure you want to start this tournament? No more participants can join after it starts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: async () => {
            try {
              await startTournament(tournamentId).unwrap();
              Alert.alert('Success', 'Tournament started!');
              refetch();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to start tournament');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!tournament) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tournament not found</Text>
      </View>
    );
  }

  const startDate = tournament.schedule?.startDate ? new Date(tournament.schedule.startDate) : null;
  const isFull = tournament.maxParticipants ? tournament.participants.length >= tournament.maxParticipants : false;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[tournament.status] || '#999' }]}>
          <Text style={styles.statusText}>{tournament.status.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={styles.sport}>{tournament.sport}</Text>
        <Text style={styles.format}>Format: {tournament.format}</Text>
        {tournament.description && (
          <Text style={styles.description}>{tournament.description}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        {startDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Date:</Text>
            <Text style={styles.detailValue}>
              {format(startDate, 'MMM dd, yyyy')}
            </Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Format:</Text>
          <Text style={styles.detailValue}>{tournament.format}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Participants:</Text>
          <Text style={styles.detailValue}>
            {tournament.participants.length}{tournament.maxParticipants ? ` / ${tournament.maxParticipants}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Participants ({tournament.participants.length})
        </Text>
        {tournament.participants.map((participant, index) => (
          <View key={participant.userId || index} style={styles.participantItem}>
            <View style={styles.participantAvatar}>
              <Text style={styles.participantAvatarText}>
                {participant.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{participant.name}</Text>
              {participant.seed && (
                <Text style={styles.participantSeed}>Seed: {participant.seed}</Text>
              )}
            </View>
            {participant.userId === tournament.createdBy && (
              <View style={styles.organizerBadge}>
                <Text style={styles.organizerText}>Organizer</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {tournament.bracket && tournament.bracket.rounds && tournament.bracket.rounds.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bracket</Text>
          {tournament.bracket.rounds.map((round, roundIndex) => (
            <View key={roundIndex} style={styles.roundContainer}>
              <Text style={styles.roundTitle}>Round {round.roundNumber}</Text>
              {round.matches.map((match, matchIndex) => (
                <View key={match.id || matchIndex} style={styles.bracketMatch}>
                  <View style={styles.matchupRow}>
                    <Text style={styles.playerName}>
                      {match.participant1 || 'TBD'}
                    </Text>
                    <Text style={styles.score}>{match.score?.participant1 || '-'}</Text>
                  </View>
                  <View style={styles.matchupRow}>
                    <Text style={styles.playerName}>
                      {match.participant2 || 'TBD'}
                    </Text>
                    <Text style={styles.score}>{match.score?.participant2 || '-'}</Text>
                  </View>
                  {match.winner && (
                    <Text style={styles.winner}>Winner: {match.winner}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {!isParticipant && tournament.status === 'upcoming' && (
          <Button
            title="Join Tournament"
            onPress={handleJoin}
            loading={isJoining}
            disabled={isFull}
          />
        )}

        {isParticipant && !isOrganizer && tournament.status === 'upcoming' && (
          <Button
            title="Leave Tournament"
            onPress={handleLeave}
            loading={isLeaving}
            variant="outline"
          />
        )}

        {isOrganizer && (
          <>
            {tournament.status === 'upcoming' && (
              <Button
                title="Start Tournament"
                onPress={handleStart}
                loading={isStarting}
                style={styles.actionButton}
              />
            )}
            <Button
              title="Delete Tournament"
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
    marginBottom: 4,
  },
  format: {
    fontSize: 14,
    color: '#666',
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
  participantSeed: {
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
  roundContainer: {
    marginBottom: 16,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bracketMatch: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  matchupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  playerName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 8,
  },
  winner: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
    marginTop: 4,
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

export default TournamentDetailScreen;
