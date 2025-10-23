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
  useGetTeamQuery,
  useJoinTeamMutation,
  useLeaveTeamMutation,
  useDeleteTeamMutation,
} from '../../store/api/teamApi';
import { useAppSelector } from '../../store/hooks';
import { useTheme } from '../../theme';
import { LoadingSpinner } from '@shared/components/atoms';
import { Button } from '@shared/components/atoms';
import { Card, Avatar, Chip, Badge, DetailRow, SectionHeader, EmptyState, ParticipantList } from '../../components/ui';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useEntityActions } from '@shared/hooks';

interface TeamDetailScreenProps {
  navigation: any;
  route: any;
}

const TeamDetailScreen: React.FC<TeamDetailScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { teamId } = route.params;
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, refetch } = useGetTeamQuery(teamId);
  const [joinTeam, { isLoading: isJoining }] = useJoinTeamMutation();
  const [leaveTeam, { isLoading: isLeaving }] = useLeaveTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();
  
  // Use reusable hook for common actions
  const { handleJoin, handleLeave, handleDelete } = useEntityActions({
    entityType: 'team',
    navigation,
    refetch,
  });

  const team = data?.data;

  const isMember = team?.members.some((m) => m.userId === user?.id);
  const isCaptain = team?.captain === user?.id;
  const isFull = team?.maxMembers ? team.members.length >= team.maxMembers : false;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!team) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="account-group-outline" size={64} color={theme.colors.textSecondary} />
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>Team not found</Text>
      </View>
    );
  }

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
          <View style={styles.headerContent}>
            <Avatar 
              name={team.name}
              size="large"
              shape="rounded"
            />
            <Text style={[styles.teamName, theme.typography.headlineMedium, { color: theme.colors.text }]}>
              {team.name}
            </Text>
            <Chip 
              label={team.sport}
              icon="soccer"
              selected
              style={styles.sportChip}
            />
            {isFull && (
              <Chip 
                label="Full"
                variant="outlined"
                style={styles.fullChip}
              />
            )}
            {team.description && (
              <Text style={[styles.description, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
                {team.description}
              </Text>
            )}
          </View>
        </Card>
      </Animated.View>

      {/* Details Card */}
      <Animated.View entering={FadeInDown.duration(300).delay(200)}>
        <Card style={styles.detailsCard}>
          <View style={styles.sectionHeader}>
            <Icon name="information" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
              Team Details
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon name="account-group" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, theme.typography.labelMedium, { color: theme.colors.textSecondary }]}>
                Members
              </Text>
              <Text style={[styles.detailValue, theme.typography.bodyLarge, { color: theme.colors.text }]}>
                {team.members.length}{team.maxMembers ? ` / ${team.maxMembers}` : ''}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Members Card */}
      <Animated.View entering={FadeInDown.duration(300).delay(300)}>
        <Card style={styles.membersCard}>
          <ParticipantList
            participants={team.members}
            title="Members"
            emptyIcon="account-group-outline"
            emptyTitle="No members yet"
            emptyMessage="Be the first to join this team!"
          />
        </Card>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View entering={FadeInDown.duration(300).delay(500)} style={styles.actions}>
        {!isMember && (
          <Button
            title="Join Team"
            icon="account-plus"
            onPress={handleJoin}
            loading={isJoining}
            disabled={isFull}
          />
        )}

        {isMember && !isCaptain && (
          <Button
            title="Leave Team"
            icon="account-minus"
            onPress={handleLeave}
            loading={isLeaving}
            variant="outline"
          />
        )}

        {isCaptain && (
          <>
            <Button
              title="Edit Team"
              icon="pencil"
              onPress={() => navigation.navigate('EditTeam', { teamId })}
              style={styles.actionButton}
            />
            <Button
              title="Delete Team"
              icon="delete"
              onPress={handleDelete}
              loading={isDeleting}
              variant="outline"
              style={styles.actionButton}
            />
          </>
        )}
      </Animated.View>
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
  },
  headerContent: {
    alignItems: 'center',
    padding: 8,
  },
  teamName: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sportChip: {
    marginVertical: 4,
  },
  fullChip: {
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
  membersCard: {
    marginHorizontal: 16,
    marginVertical: 8,
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

export default TeamDetailScreen;
