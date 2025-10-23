import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  useGetMatchQuery,
  useJoinMatchMutation,
  useLeaveMatchMutation,
  useDeleteMatchMutation,
  useUpdateStatusMutation,
} from '../../store/api/matchApi';
import { useAppSelector } from '../../store/hooks';
import { useTheme } from '../../theme';
import { LoadingSpinner } from '@shared/components/atoms';
import { Button } from '@shared/components/atoms';
import { Card, Badge, Avatar, Divider, Chip, DetailRow, SectionHeader, EmptyState, ParticipantList } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { MATCH_STATUS_COLORS } from '@core/constants';
import { useEntityActions, useConfirmation } from '@shared/hooks';

interface MatchDetailScreenProps {
  navigation: any;
  route: any;
}

const MatchDetailScreen: React.FC<MatchDetailScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { matchId } = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetMatchQuery(matchId);
  const [joinMatch, { isLoading: isJoining }] = useJoinMatchMutation();
  const [leaveMatch, { isLoading: isLeaving }] = useLeaveMatchMutation();
  const [deleteMatch, { isLoading: isDeleting }] = useDeleteMatchMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  
  // Use reusable hooks for common actions
  const { handleJoin, handleLeave, handleDelete } = useEntityActions({
    entityType: 'match',
    navigation,
    refetch,
  });
  const { showConfirmation } = useConfirmation();

  const match = data?.data;

  const isParticipant = match?.participants.some((p) => p.userId === user?.id);
  const isOrganizer = match?.createdBy === user?.id;

  const handleStatusChange = (newStatus: string) => {
    showConfirmation(
      {
        title: 'Update Status',
        message: `Change match status to ${newStatus}?`,
        confirmText: 'Confirm',
      },
      async () => {
        try {
          await updateStatus({ id: matchId, status: newStatus }).unwrap();
          Alert.alert('Success', 'Match status updated');
          refetch();
        } catch (error: any) {
          Alert.alert('Error', error?.data?.message || 'Failed to update status');
        }
      }
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!match) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={[theme.typography.titleLarge, { color: theme.colors.text, marginTop: theme.spacing.md }]}>
          Match not found
        </Text>
      </View>
    );
  }

  const matchDate = new Date(match.schedule.startTime);
  const isFull = match.maxParticipants ? match.participants.length >= match.maxParticipants : false;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ padding: theme.spacing.base }}>
        {/* Header Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
            <View style={{ padding: theme.spacing.lg }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
                <Badge
                  label={match.status.replace('_', ' ').toUpperCase()}
                  variant={MATCH_STATUS_COLORS[match.status] as any}
                  style={{ marginRight: theme.spacing.sm }}
                />
                {isFull && match.status === 'scheduled' && (
                  <Chip label="Full" icon="account-group" size="small" selected />
                )}
              </View>
              
              <Text style={[theme.typography.displaySmall, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>
                {match.title}
              </Text>
              
              <Chip label={match.sport} icon="soccer" variant="outlined" style={{ marginBottom: theme.spacing.md }} />
              
              {match.description && (
                <Text style={[theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
                  {match.description}
                </Text>
              )}
            </View>
          </Card>
        </Animated.View>

        {/* Details Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
            <View style={{ padding: theme.spacing.base }}>
              <Text style={[theme.typography.titleLarge, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
                Details
              </Text>
              <Divider style={{ marginBottom: theme.spacing.md }} />
              
              <View style={styles.detailRow}>
                <Icon name="calendar-clock" size={20} color={theme.colors.primary} />
                <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
                  <Text style={[theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                    Date & Time
                  </Text>
                  <Text style={[theme.typography.bodyLarge, { color: theme.colors.text }]}>
                    {format(matchDate, 'MMM dd, yyyy • h:mm a')}
                  </Text>
                </View>
              </View>

              {match.venue && (
                <View style={styles.detailRow}>
                  <Icon name="map-marker" size={20} color={theme.colors.primary} />
                  <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
                    <Text style={[theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                      Venue
                    </Text>
                    <Text style={[theme.typography.bodyLarge, { color: theme.colors.text }]}>
                      {match.venue.name}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.detailRow}>
                <Icon name="account-group" size={20} color={theme.colors.primary} />
                <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
                  <Text style={[theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                    Participants
                  </Text>
                  <Text style={[theme.typography.bodyLarge, { color: theme.colors.text }]}>
                    {match.participants.length}{match.maxParticipants ? ` / ${match.maxParticipants}` : ''}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Score Card (if completed) */}
        {match.score && match.status === 'completed' && (
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Card variant="elevated" style={{ marginBottom: theme.spacing.base, backgroundColor: theme.colors.successContainer }}>
              <View style={{ padding: theme.spacing.base }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
                  <Icon name="trophy" size={24} color={theme.colors.success} />
                  <Text style={[theme.typography.titleLarge, { color: theme.colors.text, marginLeft: theme.spacing.sm }]}>
                    Final Score
                  </Text>
                </View>
                <Text style={[theme.typography.headlineMedium, { color: theme.colors.text }]}>
                  {JSON.stringify(match.score)}
                </Text>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Participants Card */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
            <ParticipantList
              participants={match.participants}
              title="Participants"
              organizerId={match.createdBy}
              emptyIcon="account-group-outline"
              emptyTitle="No participants yet"
              emptyMessage="Be the first to join this match!"
            />
          </Card>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <View style={{ marginBottom: theme.spacing.xl }}>
            {!isParticipant && match.status === 'scheduled' && (
              <Button
                title={isFull ? "Match is Full" : "Join Match"}
                icon="account-plus"
                onPress={handleJoin}
                loading={isJoining}
                disabled={isFull}
                fullWidth
                style={{ marginBottom: theme.spacing.sm }}
              />
            )}

            {isParticipant && !isOrganizer && match.status === 'scheduled' && (
              <Button
                title="Leave Match"
                icon="account-minus"
                onPress={handleLeave}
                loading={isLeaving}
                variant="outline"
                fullWidth
                style={{ marginBottom: theme.spacing.sm }}
              />
            )}

            {isOrganizer && (
              <>
                {match.status === 'scheduled' && (
                  <>
                    <Button
                      title="Start Match"
                      icon="play"
                      onPress={() => handleStatusChange('in_progress')}
                      loading={isUpdating}
                      fullWidth
                      style={{ marginBottom: theme.spacing.sm }}
                    />
                    <Button
                      title="Cancel Match"
                      icon="close"
                      onPress={() => handleStatusChange('cancelled')}
                      loading={isUpdating}
                      variant="outline"
                      fullWidth
                      style={{ marginBottom: theme.spacing.sm }}
                    />
                  </>
                )}
                {match.status === 'in_progress' && (
                  <Button
                    title="Complete Match"
                    icon="check"
                    onPress={() => handleStatusChange('completed')}
                    loading={isUpdating}
                    fullWidth
                    style={{ marginBottom: theme.spacing.sm }}
                  />
                )}
                <Button
                  title="Delete Match"
                  icon="delete"
                  onPress={handleDelete}
                  loading={isDeleting}
                  variant="outline"
                  fullWidth
                />
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default MatchDetailScreen;
