import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useGetTournamentsQuery } from '../../store/api/tournamentApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format } from 'date-fns';

interface TournamentsScreenProps {
  navigation: any;
}

const TournamentsScreen: React.FC<TournamentsScreenProps> = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetTournamentsQuery({ page: 1, limit: 10 });
  const tournaments = data?.data?.items || [];

  const renderTournamentItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TournamentDetail', { tournamentId: item.id })}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.sport}>{item.sport}</Text>
      <Text style={styles.format}>{item.format.replace('_', ' ')}</Text>
      <Text style={styles.date}>
        {format(new Date(item.schedule.startDate), 'MMM dd, yyyy')}
      </Text>
      <Text style={styles.participants}>
        {item.participants.length} / {item.maxParticipants} participants
      </Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && tournaments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tournaments}
        renderItem={renderTournamentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tournaments found</Text>
          </View>
        }
      />
      <View style={styles.fab}>
        <Button
          title="Create Tournament"
          onPress={() => navigation.navigate('CreateTournament')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
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
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  participants: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusupcoming: {
    backgroundColor: '#E3F2FD',
  },
  statusin_progress: {
    backgroundColor: '#FFF3E0',
  },
  statuscompleted: {
    backgroundColor: '#E8F5E9',
  },
  statuscancelled: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
});

export default TournamentsScreen;
