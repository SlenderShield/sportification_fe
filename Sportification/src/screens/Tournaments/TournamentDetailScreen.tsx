import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  useGetTournamentQuery,
  useJoinTournamentMutation,
  useLeaveTournamentMutation,
  useDeleteTournamentMutation,
  useStartTournamentMutation,
} from '../../store/api/tournamentApi';
import { useAppSelector } from '../../store/hooks';
import { useTheme } from '../../theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Card, Avatar, Chip, Badge, DetailRow, SectionHeader, EmptyState } from '../../components/ui';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { format } from 'date-fns';
import { TOURNAMENT_STATUS_COLORS } from '../../constants/statusColors';
import { useEntityActions, useConfirmation } from '../../hooks';

interface TournamentDetailScreenProps {
  navigation: any;
  route: any;
}

const TournamentDetailScreen: React.FC<TournamentDetailScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { tournamentId } = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetTournamentQuery(tournamentId);
  const [joinTournament, { isLoading: isJoining }] = useJoinTournamentMutation();
  const [leaveTournament, { isLoading: isLeaving }] = useLeaveTournamentMutation();
  const [deleteTournament, { isLoading: isDeleting }] = useDeleteTournamentMutation();
  const [startTournament, { isLoading: isStarting }] = useStartTournamentMutation();
  
  // Use reusable hooks for common actions
  const { handleJoin, handleLeave, handleDelete } = useEntityActions({
    entityType: 'tournament',
    navigation,
    refetch,
  });
  const { showConfirmation } = useConfirmation();

  const tournament = data?.data;

  const isParticipant = tournament?.participants.some((p) => p.userId === user?.id);
  const isOrganizer = tournament?.createdBy === user?.id;
  const isFull = tournament?.maxParticipants ? tournament.participants.length >= tournament.maxParticipants : false;

  const handleStart = () => {
    showConfirmation(
      {
        title: 'Start Tournament',
        message: 'Are you sure you want to start this tournament? No more participants can join after it starts.',
        confirmText: 'Start',
      },
      async () => {
        try {
          await startTournament(tournamentId).unwrap();
          Alert.alert('Success', 'Tournament started!');
          refetch();
        } catch (error: any) {
          Alert.alert('Error', error?.data?.message || 'Failed to start tournament');
        }
      }
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!tournament) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="trophy-outline" size={64} color={theme.colors.textSecondary} />
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>Tournament not found</Text>
      </View>
    );
  }

  const startDate = tournament.schedule?.startDate ? new Date(tournament.schedule.startDate) : null;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Header Card */}
      <Animated.View entering={FadeInDown.duration(300).delay(100)}>
        <Card style={styles.headerCard}>
          <Badge 
            label={tournament.status.toUpperCase().replace('_', ' ')}
            variant={TOURNAMENT_STATUS_COLORS[tournament.status] as any}
            style={styles.statusBadge}
          />
          {isFull && (
            <Chip 
              label="Full"
              variant="outlined"
              style={styles.fullChip}
            />
          )}
          <Text style={[styles.tournamentName, theme.typography.headlineMedium, { color: theme.colors.text }]}>
            {tournament.name}
          </Text>
          <Chip 
            label={tournament.sport}
            icon="soccer"
            selected
            style={styles.sportChip}
          />
          <Chip 
            label={tournament.format.replace('-', ' ')}
            icon="trophy-variant"
            variant="outlined"
            style={styles.formatChip}
          />
          {tournament.description && (
            <Text style={[styles.description, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
              {tournament.description}
            </Text>
          )}
        </Card>
      </Animated.View>

      {/* Details Card */}
      <Animated.View entering={FadeInDown.duration(300).delay(200)}>
        <Card style={styles.detailsCard}>
          <View style={styles.sectionHeader}>
            <Icon name="information" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
              Tournament Details
            </Text>
          </View>

          {startDate && (
            <View style={styles.detailRow}>
              <View style={[styles.detailIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <Icon name="calendar-clock" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                  Start Date
                </Text>
                <Text style={[styles.detailValue, theme.typography.bodyLarge, { color: theme.colors.text }]}>
                  {format(startDate, 'MMM dd, yyyy')}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.detailRow}>
            <View style={[styles.detailIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon name="trophy-variant" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                Format
              </Text>
              <Text style={[styles.detailValue, theme.typography.bodyLarge, { color: theme.colors.text }]}>
                {tournament.format.replace('-', ' ')}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon name="account-multiple" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                Participants
              </Text>
              <Text style={[styles.detailValue, theme.typography.bodyLarge, { color: theme.colors.text }]}>
                {tournament.participants.length}{tournament.maxParticipants ? ` / ${tournament.maxParticipants}` : ''}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Participants Card */}
      <Animated.View entering={FadeInDown.duration(300).delay(300)}>
        <Card style={styles.participantsCard}>
          <View style={styles.sectionHeader}>
            <Icon name="account-group" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
              Participants ({tournament.participants.length})
            </Text>
          </View>

          {tournament.participants.map((participant, index) => (
            <Animated.View 
              key={participant.userId || index} 
              entering={FadeInDown.duration(300).delay(400 + index * 50)}
            >
              <Card variant="outlined" style={styles.participantItem}>
                <Avatar 
                  name={participant.name}
                  size="small"
                />
                <View style={styles.participantInfo}>
                  <Text style={[styles.participantName, theme.typography.titleMedium, { color: theme.colors.text }]}>
                    {participant.name}
                  </Text>
                  {participant.seed && (
                    <Text style={[styles.participantSeed, theme.typography.labelSmall, { color: theme.colors.textSecondary }]}>
                      Seed: {participant.seed}
                    </Text>
                  )}
                </View>
                {participant.userId === tournament.createdBy && (
                  <Chip 
                    label="Organizer"
                    icon="crown"
                    selected
                    size="small"
                  />
                )}
              </Card>
            </Animated.View>
          ))}
        </Card>
      </Animated.View>

      {/* Bracket Card */}
      {tournament.bracket && tournament.bracket.rounds && tournament.bracket.rounds.length > 0 && (
        <Animated.View entering={FadeInDown.duration(300).delay(400)}>
          <Card style={styles.bracketCard}>
            <View style={styles.sectionHeader}>
              <Icon name="tournament" size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
                Tournament Bracket
              </Text>
            </View>

            {tournament.bracket.rounds.map((round, roundIndex) => (
              <View key={roundIndex} style={styles.roundContainer}>
                <Text style={[styles.roundTitle, theme.typography.titleMedium, { color: theme.colors.text }]}>
                  Round {round.roundNumber}
                </Text>
                {round.matches.map((match, matchIndex) => (
                  <Card 
                    key={match.id || matchIndex} 
                    variant="outlined"
                    style={styles.bracketMatch}
                  >
                    <View style={styles.matchupRow}>
                      <Text style={[styles.playerName, theme.typography.bodyMedium, { color: theme.colors.text }]}>
                        {match.participant1 || 'TBD'}
                      </Text>
                      <Text style={[styles.score, theme.typography.titleSmall, { color: theme.colors.primary }]}>
                        {match.score?.participant1 || '-'}
                      </Text>
                    </View>
                    <View style={styles.matchupRow}>
                      <Text style={[styles.playerName, theme.typography.bodyMedium, { color: theme.colors.text }]}>
                        {match.participant2 || 'TBD'}
                      </Text>
                      <Text style={[styles.score, theme.typography.titleSmall, { color: theme.colors.primary }]}>
                        {match.score?.participant2 || '-'}
                      </Text>
                    </View>
                    {match.winner && (
                      <View style={styles.winnerContainer}>
                        <Icon name="trophy" size={16} color={theme.colors.success} />
                        <Text style={[styles.winner, theme.typography.labelMedium, { color: theme.colors.success }]}>
                          Winner: {match.winner}
                        </Text>
                      </View>
                    )}
                  </Card>
                ))}
              </View>
            ))}
          </Card>
        </Animated.View>
      )}

      {/* Action Buttons */}
      <Animated.View entering={FadeInDown.duration(300).delay(500)} style={styles.actions}>
        {!isParticipant && tournament.status === 'upcoming' && (
          <Button
            title="Join Tournament"
            icon="account-plus"
            onPress={handleJoin}
            loading={isJoining}
            disabled={isFull}
          />
        )}

        {isParticipant && !isOrganizer && tournament.status === 'upcoming' && (
          <Button
            title="Leave Tournament"
            icon="account-minus"
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
                icon="play"
                onPress={handleStart}
                loading={isStarting}
              />
            )}
            <Button
              title="Delete Tournament"
              icon="delete"
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
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
    alignItems: 'center',
    padding: 8,
  },
  statusBadge: {
    marginBottom: 8,
  },
  fullChip: {
    marginBottom: 8,
  },
  tournamentName: {
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  sportChip: {
    marginVertical: 4,
  },
  formatChip: {
    marginVertical: 4,
  },
  description: {
    textAlign: 'center',
    marginTop: 12,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    marginBottom: 2,
  },
  detailValue: {
    fontWeight: '600',
  },
  participantsCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    marginBottom: 2,
  },
  participantSeed: {
  },
  bracketCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  roundContainer: {
    marginBottom: 16,
  },
  roundTitle: {
    marginBottom: 12,
  },
  bracketMatch: {
    padding: 12,
    marginBottom: 8,
  },
  matchupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    alignItems: 'center',
  },
  playerName: {
    flex: 1,
  },
  score: {
    fontWeight: 'bold',
    marginLeft: 8,
    minWidth: 24,
    textAlign: 'center',
  },
  winnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  winner: {
    fontWeight: '600',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    marginTop: 0,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default TournamentDetailScreen;
