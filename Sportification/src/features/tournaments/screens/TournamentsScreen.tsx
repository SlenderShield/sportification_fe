import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGetTournamentsQuery } from '../../store/api/tournamentApi';
import { useTheme } from '../../theme';
import { LoadingSpinner } from '@shared/components/atoms';
import { Card, FAB, Badge, EmptyState } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

interface TournamentsScreenProps {
  navigation: any;
}

const TournamentsScreen: React.FC<TournamentsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetTournamentsQuery({ page: 1, limit: 10 });
  const tournaments = data?.data?.items || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'info';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderTournamentItem = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Card
        onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item.id })}
        style={{ marginBottom: theme.spacing.md }}
        elevation="md"
      >
        <View style={{ padding: theme.spacing.base }}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.titleLarge,
                  { color: theme.colors.text, marginBottom: theme.spacing.xs },
                ]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Badge
                label={item.status}
                variant={getStatusVariant(item.status)}
                size="small"
              />
            </View>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <Icon name="trophy" size={32} color={theme.colors.primary} />
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: theme.spacing.md }]}>
            <Icon
              name="soccer"
              size={16}
              color={theme.colors.primary}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text
              style={[
                theme.typography.bodyMedium,
                { color: theme.colors.primary, fontWeight: '600' },
              ]}
            >
              {item.sport}
            </Text>
          </View>

          <View style={[styles.infoRow, { marginTop: theme.spacing.sm }]}>
            <Icon
              name="format-list-bulleted"
              size={16}
              color={theme.colors.textSecondary}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text
              style={[
                theme.typography.bodySmall,
                {
                  color: theme.colors.textSecondary,
                  textTransform: 'capitalize',
                },
              ]}
            >
              {item.format.replace('_', ' ')}
            </Text>
          </View>

          <View style={[styles.infoRow, { marginTop: theme.spacing.sm }]}>
            <Icon
              name="calendar"
              size={16}
              color={theme.colors.textSecondary}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text
              style={[
                theme.typography.bodySmall,
                { color: theme.colors.textSecondary },
              ]}
            >
              {format(new Date(item.schedule.startDate), 'MMM dd, yyyy')}
            </Text>
          </View>

          <View style={[styles.infoRow, { marginTop: theme.spacing.sm }]}>
            <Icon
              name="account-group"
              size={16}
              color={theme.colors.textSecondary}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text
              style={[
                theme.typography.bodySmall,
                { color: theme.colors.textSecondary },
              ]}
            >
              {item.participants.length} / {item.maxParticipants} participants
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  if (isLoading && tournaments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={tournaments}
        renderItem={renderTournamentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { padding: theme.spacing.base, paddingBottom: 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="trophy-outline"
            title="No tournaments found"
            message="Create your first tournament to get started"
          />
        }
      />
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CreateTournament')}
        variant="primary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TournamentsScreen;
