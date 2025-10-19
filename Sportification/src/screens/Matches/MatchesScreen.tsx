import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useGetMatchesQuery } from '../../store/api/matchApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format } from 'date-fns';

interface MatchesScreenProps {
  navigation: any;
}

const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetMatchesQuery({ page, limit: 10 });

  const matches = data?.data?.items || [];

  const renderMatchItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
    >
      <View style={styles.matchHeader}>
        <Text style={styles.matchTitle}>{item.title}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.matchSport}>{item.sport}</Text>
      {item.venue && (
        <Text style={styles.matchVenue}>{item.venue.name}</Text>
      )}
      <Text style={styles.matchTime}>
        {format(new Date(item.schedule.startTime), 'MMM dd, yyyy HH:mm')}
      </Text>
      <Text style={styles.matchParticipants}>
        {item.participants.length} / {item.maxParticipants} participants
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && matches.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matches found</Text>
          </View>
        }
      />
      <View style={styles.fab}>
        <Button
          title="Create Match"
          onPress={() => navigation.navigate('CreateMatch')}
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
  matchCard: {
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
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusscheduled: {
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
  matchSport: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  matchVenue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  matchTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  matchParticipants: {
    fontSize: 14,
    color: '#666',
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

export default MatchesScreen;
