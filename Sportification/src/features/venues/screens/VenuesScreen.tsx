import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGetVenuesQuery } from '../../store/api/venueApi';
import { useTheme } from '../../theme';
import { LoadingSpinner } from '@shared/components/atoms';
import { Card, Badge, EmptyState } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface VenuesScreenProps {
  navigation: any;
}

const VenuesScreen: React.FC<VenuesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetVenuesQuery({ page: 1, limit: 10 });
  const venues = data?.data?.items || [];

  const renderVenueItem = ({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Card
        onPress={() => navigation.navigate('VenueDetail', { venueId: item.id })}
        style={{ marginBottom: theme.spacing.md }}
        elevation="md"
      >
        <View style={{ padding: theme.spacing.base }}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.titleLarge,
                  {
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs,
                  },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              
              <View style={[styles.row, { marginBottom: theme.spacing.sm }]}>
                <Icon
                  name="map-marker"
                  size={16}
                  color={theme.colors.textSecondary}
                  style={{ marginRight: theme.spacing.xs }}
                />
                <Text
                  style={[
                    theme.typography.bodySmall,
                    { color: theme.colors.textSecondary, flex: 1 },
                  ]}
                  numberOfLines={2}
                >
                  {item.address}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme.colors.tertiaryContainer,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <Icon
                name="map-marker-radius"
                size={32}
                color={theme.colors.tertiary}
              />
            </View>
          </View>

          <View
            style={[
              styles.sportsContainer,
              { marginTop: theme.spacing.md, marginBottom: theme.spacing.sm },
            ]}
          >
            {item.sports.slice(0, 3).map((sport: string, idx: number) => (
              <Badge
                key={idx}
                label={sport}
                variant="info"
                size="small"
                style={{ marginRight: theme.spacing.xs, marginBottom: theme.spacing.xs }}
              />
            ))}
            {item.sports.length > 3 && (
              <Badge
                label={`+${item.sports.length - 3}`}
                variant="default"
                size="small"
              />
            )}
          </View>

          {item.pricing && item.pricing.length > 0 && (
            <View
              style={[
                styles.priceContainer,
                {
                  backgroundColor: theme.colors.successContainer,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.sm,
                  marginTop: theme.spacing.sm,
                },
              ]}
            >
              <Icon
                name="cash"
                size={20}
                color={theme.colors.success}
                style={{ marginRight: theme.spacing.sm }}
              />
              <Text
                style={[
                  theme.typography.titleMedium,
                  { color: theme.colors.success },
                ]}
              >
                From ${item.pricing[0].pricePerHour}/hour
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Animated.View>
  );

  if (isLoading && venues.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={venues}
        renderItem={renderVenueItem}
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
            icon="map-marker-off-outline"
            title="No venues found"
            message="Search for venues in your area"
          />
        }
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
  },
  iconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default VenuesScreen;
