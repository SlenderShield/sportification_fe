/**
 * ParticipantList Component
 * Reusable participant/member list display component
 * Used in Match, Team, and Tournament detail screens
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Chip, Divider, EmptyState } from './';
import { useTheme } from '../../theme';
import { format } from 'date-fns';

interface Participant {
  userId: string;
  username?: string;
  name?: string;
  joinedAt?: string;
  role?: string;
  seed?: number;
}

interface ParticipantListProps {
  participants: Participant[];
  title?: string;
  organizerId?: string;
  emptyIcon?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  showSeed?: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  title = 'Participants',
  organizerId,
  emptyIcon = 'account-group-outline',
  emptyTitle = 'No participants yet',
  emptyMessage = 'Be the first to join!',
  showSeed = false,
}) => {
  const { theme } = useTheme();

  if (participants.length === 0) {
    return (
      <View style={{ padding: theme.spacing.base }}>
        <Text style={[theme.typography.titleLarge, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
          {title} (0)
        </Text>
        <Divider style={{ marginBottom: theme.spacing.md }} />
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          message={emptyMessage}
        />
      </View>
    );
  }

  return (
    <View style={{ padding: theme.spacing.base }}>
      <Text style={[theme.typography.titleLarge, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
        {title} ({participants.length})
      </Text>
      <Divider style={{ marginBottom: theme.spacing.md }} />
      
      {participants.map((participant, index) => {
        const displayName = participant.username || participant.name || 'Unknown';
        
        return (
          <View key={participant.userId || index} style={[styles.participantRow, { marginBottom: theme.spacing.md }]}>
            <Avatar
              name={displayName}
              size="medium"
              variant="circular"
            />
            <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
              <Text style={[theme.typography.titleMedium, { color: theme.colors.text }]}>
                {displayName}
              </Text>
              {participant.joinedAt && (
                <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                  {participant.role === 'captain' ? 'Created' : 'Joined'}: {format(new Date(participant.joinedAt), 'MMM dd, yyyy')}
                </Text>
              )}
              {showSeed && participant.seed && (
                <Text style={[theme.typography.bodySmall, { color: theme.colors.textSecondary }]}>
                  Seed: {participant.seed}
                </Text>
              )}
            </View>
            {participant.userId === organizerId && (
              <Chip label="Organizer" icon="crown" size="small" selected />
            )}
            {participant.role === 'captain' && !organizerId && (
              <Chip label="Captain" icon="crown" size="small" selected />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ParticipantList;
