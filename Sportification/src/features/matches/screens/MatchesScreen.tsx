import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useMatchesScreen } from '../hooks';
import { useTheme } from '../../../theme';
import { ListScreenTemplate } from '@shared/components/templates';
import { Card, Badge } from '@shared/components/organisms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

interface MatchesScreenProps {
  navigation: any;
}

const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const props = useMatchesScreen(navigation);

  const renderMatchItem = (item: any, index: number) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Card
        onPress={() => props.onMatchPress(item.id)}
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
              variant={props.getStatusVariant(item.status)}
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

  return (
    <ListScreenTemplate
      title="Matches"
      items={props.matches}
      renderItem={renderMatchItem}
      isLoading={props.isLoading}
      error={props.error}
      onRefresh={props.onRefresh}
      onAddNew={props.onCreateMatch}
      emptyMessage="No matches found"
      searchPlaceholder="Search matches..."
    />
  );
};

const styles = StyleSheet.create({
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
