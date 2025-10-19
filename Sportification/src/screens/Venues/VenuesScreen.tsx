import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useGetVenuesQuery } from '../../store/api/venueApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface VenuesScreenProps {
  navigation: any;
}

const VenuesScreen: React.FC<VenuesScreenProps> = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetVenuesQuery({ page: 1, limit: 10 });
  const venues = data?.data?.items || [];

  const renderVenueItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VenueDetail', { venueId: item.id })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <View style={styles.sportsContainer}>
        {item.sports.map((sport: string, index: number) => (
          <View key={index} style={styles.sportTag}>
            <Text style={styles.sportText}>{sport}</Text>
          </View>
        ))}
      </View>
      {item.pricing && item.pricing.length > 0 && (
        <Text style={styles.price}>
          From ${item.pricing[0].pricePerHour}/hour
        </Text>
      )}
    </TouchableOpacity>
  );

  if (isLoading && venues.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={venues}
        renderItem={renderVenueItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No venues found</Text>
          </View>
        }
      />
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  sportTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  sportText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
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
});

export default VenuesScreen;
