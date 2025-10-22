import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGetVenueQuery } from '../../store/api/venueApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import MapComponent from '../../components/map/MapComponent';

interface VenueDetailScreenProps {
  navigation: any;
  route: any;
}

const VenueDetailScreen: React.FC<VenueDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { venueId } = route.params;
  const { data, isLoading } = useGetVenueQuery(venueId);

  const venue = data?.data;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!venue) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('venues.title')} not found</Text>
      </View>
    );
  }

  // Extract coordinates for map
  const venueCoordinates = venue.location?.coordinates
    ? {
        latitude: venue.location.coordinates.coordinates[1],
        longitude: venue.location.coordinates.coordinates[0],
      }
    : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{venue.name}</Text>
        <Text style={styles.address}>
          {venue.location?.address}, {venue.location?.city}
        </Text>
        {venue.description && (
          <Text style={styles.description}>{venue.description}</Text>
        )}
      </View>

      {/* Map Section */}
      {venueCoordinates && (
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>{t('venues.getDirections')}</Text>
          <MapComponent
            markers={[
              {
                id: venue._id,
                coordinate: venueCoordinates,
                title: venue.name,
                description: venue.location?.address,
              },
            ]}
            height={250}
            showUserLocation
            showDirectionsButton
            selectedMarkerId={venue._id}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('matches.sport')}</Text>
        <View style={styles.sportsContainer}>
          {venue.sports.map((sport, index) => (
            <View key={index} style={styles.sportTag}>
              <Text style={styles.sportText}>{sport}</Text>
            </View>
          ))}
        </View>
      </View>

      {venue.pricing && venue.pricing.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('venues.pricing')}</Text>
          {venue.pricing.map((price, index) => (
            <View key={index} style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>{price.sport || 'General'}</Text>
              <Text style={styles.pricingValue}>
                {price.currency}{price.pricePerHour}/hr
              </Text>
            </View>
          ))}
        </View>
      )}

      {venue.facilities && venue.facilities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('venues.facilities')}</Text>
          <View style={styles.amenitiesContainer}>
            {venue.facilities.map((facility: string, index: number) => (
              <Text key={index} style={styles.amenityItem}>
                • {facility}
              </Text>
            ))}
          </View>
        </View>
      )}

      {venue.operatingHours && venue.operatingHours.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('venues.checkAvailability')}</Text>
          {venue.operatingHours.map((hours, index) => (
            <View key={index} style={styles.hoursRow}>
              <Text style={styles.hoursLabel}>
                {hours.day}:
              </Text>
              <Text style={styles.hoursValue}>
                {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title={t('venues.checkAvailability')}
          onPress={() => navigation.navigate('CheckAvailability', { venueId: venue._id })}
          style={styles.actionButton}
          variant="outline"
        />
        <Button
          title={t('venues.bookVenue')}
          onPress={() => navigation.navigate('CreateBooking', { venueId: venue._id, venueName: venue.name })}
        />
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  mapSection: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
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
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sportTag: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  sportText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pricingLabel: {
    fontSize: 14,
    color: '#666',
  },
  pricingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  amenitiesContainer: {
    marginTop: 8,
  },
  amenityItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  hoursLabel: {
    fontSize: 14,
    color: '#666',
  },
  hoursValue: {
    fontSize: 14,
    color: '#333',
  },
  actions: {
    padding: 16,
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 12,
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

export default VenueDetailScreen;
