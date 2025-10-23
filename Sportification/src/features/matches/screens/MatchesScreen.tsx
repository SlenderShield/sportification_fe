import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGetMatchesQuery } from '../../store/api/matchApi';
import { useTheme } from '../../theme';
import { LoadingSpinner } from '@shared/components/atoms';
import { Card, FAB, Badge, EmptyState } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

interface MatchesScreenProps {
  navigation: any;
}

const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetMatchesQuery({ page, limit: 10 });

  const matches = data?.data?.items || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
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

  const renderMatchItem = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Card
        onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
        style={{ marginBottom: theme.spacing.md }}
      >
        <View style={{ padding: theme.spacing.base }}>
          <View style={styles.matchHeader}>
            <Text
              style={[
                theme.typography.titleLarge,
                { color: theme.colors.text, flex: 1 },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Badge
              label={item.status}
              variant={getStatusVariant(item.status)}
              size="small"
            />
          </View>

          <View style={[styles.row, { marginTop: theme.spacing.md }]}>
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

          {item.venue && (
            <View style={[styles.row, { marginTop: theme.spacing.sm }]}>
              <Icon
                name="map-marker"
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
                {item.venue.name}
              </Text>
            </View>
          )}

          <View style={[styles.row, { marginTop: theme.spacing.sm }]}>
            <Icon
              name="clock-outline"
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
              {format(new Date(item.schedule.startTime), 'MMM dd, yyyy HH:mm')}
            </Text>
          </View>

          <View style={[styles.row, { marginTop: theme.spacing.sm }]}>
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

  if (isLoading && matches.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={matches}
        renderItem={renderMatchItem}
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
            icon="soccer-field"
            title="No matches found"
            message="Create your first match to get started"
          />
        }
      />
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CreateMatch')}
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
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MatchesScreen;
