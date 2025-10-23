import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGetVenueQuery } from '../../store/api/venueApi';
import { useTheme } from '../../theme';
import { LoadingSpinner } from '@shared/components/atoms';
import { Button } from '@shared/components/atoms';
import { Card, Chip } from '../../components/ui';
import { Icon } from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import MapComponent from '../../components/map/MapComponent';

interface VenueDetailScreenProps {
  navigation: any;
  route: any;
}

const VenueDetailScreen: React.FC<VenueDetailScreenProps> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { venueId } = route.params;
  const { data, isLoading } = useGetVenueQuery(venueId);

  const venue = data?.data;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!venue) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="map-marker-off" size={64} color={theme.colors.textSecondary} />
        <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
          {t('venues.title')} not found
        </Text>
      </View>
    );
  }

  const venueCoordinates = venue.location?.coordinates
    ? {
        latitude: venue.location.coordinates.coordinates[1],
        longitude: venue.location.coordinates.coordinates[0],
      }
    : null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Card */}
      <Animated.View entering={FadeInDown.duration(300).delay(100)}>
        <Card style={styles.headerCard}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
            <Icon name="map-marker" size={40} color={theme.colors.primary} />
          </View>
          <Text style={[styles.venueName, theme.typography.headlineMedium, { color: theme.colors.text }]}>
            {venue.name}
          </Text>
          <Text style={[styles.address, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
            {venue.location?.address}, {venue.location?.city}
          </Text>
          {venue.description && (
            <Text style={[styles.description, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
              {venue.description}
            </Text>
          )}
        </Card>
      </Animated.View>

      {/* Map Card */}
      {venueCoordinates && (
        <Animated.View entering={FadeInDown.duration(300).delay(200)}>
          <Card style={styles.mapCard}>
            <View style={styles.sectionHeader}>
              <Icon name="map" size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
                {t('venues.getDirections')}
              </Text>
            </View>
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
          </Card>
        </Animated.View>
      )}

      {/* Sports Card */}
      <Animated.View entering={FadeInDown.duration(300).delay(300)}>
        <Card style={styles.sportsCard}>
          <View style={styles.sectionHeader}>
            <Icon name="soccer" size={24} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
              {t('matches.sport')}
            </Text>
          </View>
          <View style={styles.chipsContainer}>
            {venue.sports.map((sport, index) => (
              <Chip
                key={index}
                label={sport}
                icon="soccer"
                selected
              />
            ))}
          </View>
        </Card>
      </Animated.View>

      {/* Pricing Card */}
      {venue.pricing && venue.pricing.length > 0 && (
        <Animated.View entering={FadeInDown.duration(300).delay(400)}>
          <Card style={styles.pricingCard}>
            <View style={styles.sectionHeader}>
              <Icon name="cash" size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
                {t('venues.pricing')}
              </Text>
            </View>
            {venue.pricing.map((price, index) => (
              <View key={index} style={styles.pricingRow}>
                <Text style={[styles.pricingLabel, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
                  {price.sport || 'General'}
                </Text>
                <View style={[styles.pricingBadge, { backgroundColor: theme.colors.success + '20' }]}>
                  <Icon name="cash" size={16} color={theme.colors.success} />
                  <Text style={[styles.pricingValue, theme.typography.titleMedium, { color: theme.colors.success }]}>
                    {price.currency}{price.pricePerHour}/hr
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </Animated.View>
      )}

      {/* Facilities Card */}
      {venue.facilities && venue.facilities.length > 0 && (
        <Animated.View entering={FadeInDown.duration(300).delay(500)}>
          <Card style={styles.facilitiesCard}>
            <View style={styles.sectionHeader}>
              <Icon name="check-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
                {t('venues.facilities')}
              </Text>
            </View>
            <View style={styles.facilitiesList}>
              {venue.facilities.map((facility: string, index: number) => (
                <View key={index} style={styles.facilityItem}>
                  <Icon name="check" size={16} color={theme.colors.success} />
                  <Text style={[styles.facilityText, theme.typography.bodyMedium, { color: theme.colors.text }]}>
                    {facility}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>
      )}

      {/* Operating Hours Card */}
      {venue.operatingHours && venue.operatingHours.length > 0 && (
        <Animated.View entering={FadeInDown.duration(300).delay(600)}>
          <Card style={styles.hoursCard}>
            <View style={styles.sectionHeader}>
              <Icon name="clock-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, theme.typography.titleLarge, { color: theme.colors.text }]}>
                Operating Hours
              </Text>
            </View>
            {venue.operatingHours.map((hours, index) => (
              <View key={index} style={styles.hoursRow}>
                <Text style={[styles.hoursLabel, theme.typography.bodyMedium, { color: theme.colors.textSecondary }]}>
                  {hours.day}
                </Text>
                <Text style={[styles.hoursValue, theme.typography.bodyMedium, { color: theme.colors.text }]}>
                  {hours.isClosed ? 'Closed' : `${hours.open} - ${hours.close}`}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      )}

      {/* Action Buttons */}
      <Animated.View entering={FadeInDown.duration(300).delay(700)} style={styles.actions}>
        <Button
          title={t('venues.checkAvailability')}
          icon="calendar-search"
          onPress={() => navigation.navigate('CheckAvailability', { venueId: venue._id })}
          variant="outline"
        />
        <Button
          title={t('venues.bookVenue')}
          icon="calendar-plus"
          onPress={() => navigation.navigate('CreateBooking', { venueId: venue._id, venueName: venue.name })}
        />
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  venueName: {
    marginBottom: 8,
    textAlign: 'center',
  },
  address: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginTop: 8,
  },
  mapCard: {
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
  sportsCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pricingCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  pricingLabel: {
    flex: 1,
  },
  pricingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  pricingValue: {
    fontWeight: '600',
  },
  facilitiesCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  facilitiesList: {
    gap: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  facilityText: {
  },
  hoursCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  hoursLabel: {
    flex: 1,
  },
  hoursValue: {
    fontWeight: '600',
  },
  actions: {
    padding: 16,
    gap: 12,
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

export default VenueDetailScreen;
