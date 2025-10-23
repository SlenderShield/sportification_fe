import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { useGetUserStatsQuery, useGetUserAchievementsQuery } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../store/slices/authSlice';
import { apiService } from '@shared/services/api';
import { socketService } from '@shared/services/socketService';
import { useTheme } from '../../theme';
import { LoadingSpinner } from '@shared/components/atoms';
import { Button } from '@shared/components/atoms';
import { Card } from '@shared/components/organisms';
import Avatar from '../../components/ui/Avatar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const { data: statsData, isLoading: statsLoading } = useGetUserStatsQuery(
    user?.id || '',
    { skip: !user?.id }
  );

  const { data: achievementsData, isLoading: achievementsLoading } = useGetUserAchievementsQuery(
    user?.id || '',
    { skip: !user?.id }
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          socketService.disconnect();
          await apiService.clearTokens();
          dispatch(clearUser());
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[theme.typography.bodyLarge, { color: theme.colors.text }]}>
          Please login
        </Text>
      </View>
    );
  }

  const stats = statsData?.data;
  const achievements = achievementsData?.data || [];

  const menuItems = [
    { icon: 'account-edit', title: 'Edit Profile', screen: 'EditProfile' },
    { icon: 'account-group', title: 'Friends', screen: 'Friends' },
    { icon: 'bell', title: 'Notifications', screen: 'Notifications' },
    { icon: 'lock', title: 'Change Password', screen: 'ChangePassword' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: theme.spacing['2xl'] }}
    >
      {/* Header Section */}
      <Card
        variant="elevated"
        style={{ marginBottom: theme.spacing.base }}
      >
        <View style={{ padding: theme.spacing.xl, alignItems: 'center' }}>
          <Avatar
            name={user.username}
            size="xlarge"
            variant="circular"
            style={{ marginBottom: theme.spacing.md }}
          />
          <Text
            style={[
              theme.typography.headlineMedium,
              { color: theme.colors.text, marginBottom: theme.spacing.xs },
            ]}
          >
            {user.username}
          </Text>
          <Text
            style={[
              theme.typography.bodyMedium,
              { color: theme.colors.textSecondary },
            ]}
          >
            {user.email}
          </Text>
          {user.profile.bio && (
            <Text
              style={[
                theme.typography.bodySmall,
                {
                  color: theme.colors.textSecondary,
                  marginTop: theme.spacing.md,
                  textAlign: 'center',
                },
              ]}
            >
              {user.profile.bio}
            </Text>
          )}
        </View>
      </Card>

      {/* Statistics Section */}
      {statsLoading ? (
        <LoadingSpinner />
      ) : stats && (
        <Card
          variant="elevated"
          style={{ marginBottom: theme.spacing.base }}
        >
          <View style={{ padding: theme.spacing.base }}>
            <Text
              style={[
                theme.typography.titleLarge,
                {
                  color: theme.colors.text,
                  marginBottom: theme.spacing.base,
                },
              ]}
            >
              Statistics
            </Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statItem, { backgroundColor: theme.colors.primaryContainer }]}>
                <Icon
                  name="soccer"
                  size={32}
                  color={theme.colors.primary}
                  style={{ marginBottom: theme.spacing.sm }}
                />
                <Text
                  style={[
                    theme.typography.displaySmall,
                    {
                      color: theme.colors.primary,
                      marginBottom: theme.spacing.xs,
                    },
                  ]}
                >
                  {stats.matchesPlayed}
                </Text>
                <Text
                  style={[
                    theme.typography.labelSmall,
                    { color: theme.colors.onPrimaryContainer, textAlign: 'center' },
                  ]}
                >
                  Matches Played
                </Text>
              </View>

              <View style={[styles.statItem, { backgroundColor: theme.colors.secondaryContainer }]}>
                <Icon
                  name="trophy"
                  size={32}
                  color={theme.colors.secondary}
                  style={{ marginBottom: theme.spacing.sm }}
                />
                <Text
                  style={[
                    theme.typography.displaySmall,
                    {
                      color: theme.colors.secondary,
                      marginBottom: theme.spacing.xs,
                    },
                  ]}
                >
                  {stats.matchesWon}
                </Text>
                <Text
                  style={[
                    theme.typography.labelSmall,
                    { color: theme.colors.onSecondaryContainer, textAlign: 'center' },
                  ]}
                >
                  Matches Won
                </Text>
              </View>

              <View style={[styles.statItem, { backgroundColor: theme.colors.tertiaryContainer }]}>
                <Icon
                  name="tournament"
                  size={32}
                  color={theme.colors.tertiary}
                  style={{ marginBottom: theme.spacing.sm }}
                />
                <Text
                  style={[
                    theme.typography.displaySmall,
                    {
                      color: theme.colors.tertiary,
                      marginBottom: theme.spacing.xs,
                    },
                  ]}
                >
                  {stats.tournamentsPlayed}
                </Text>
                <Text
                  style={[
                    theme.typography.labelSmall,
                    { color: theme.colors.onTertiaryContainer, textAlign: 'center' },
                  ]}
                >
                  Tournaments
                </Text>
              </View>

              <View style={[styles.statItem, { backgroundColor: theme.colors.primaryContainer }]}>
                <Icon
                  name="trophy-award"
                  size={32}
                  color={theme.colors.primary}
                  style={{ marginBottom: theme.spacing.sm }}
                />
                <Text
                  style={[
                    theme.typography.displaySmall,
                    {
                      color: theme.colors.primary,
                      marginBottom: theme.spacing.xs,
                    },
                  ]}
                >
                  {stats.tournamentsWon}
                </Text>
                <Text
                  style={[
                    theme.typography.labelSmall,
                    { color: theme.colors.onPrimaryContainer, textAlign: 'center' },
                  ]}
                >
                  Tournament Wins
                </Text>
              </View>
            </View>
          </View>
        </Card>
      )}

      {/* Achievements Section */}
      {!achievementsLoading && achievements.length > 0 && (
        <Card
          variant="elevated"
          style={{ marginBottom: theme.spacing.base }}
        >
          <View style={{ padding: theme.spacing.base }}>
            <Text
              style={[
                theme.typography.titleLarge,
                {
                  color: theme.colors.text,
                  marginBottom: theme.spacing.base,
                },
              ]}
            >
              Achievements
            </Text>
            {achievements.map((achievement, index) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  {
                    paddingVertical: theme.spacing.md,
                    borderBottomWidth: index < achievements.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.divider,
                  },
                ]}
              >
                <Text style={{ fontSize: 32, marginRight: theme.spacing.base }}>
                  {achievement.icon}
                </Text>
                <View style={styles.achievementInfo}>
                  <Text
                    style={[
                      theme.typography.titleMedium,
                      { color: theme.colors.text, marginBottom: theme.spacing.xs },
                    ]}
                  >
                    {achievement.name}
                  </Text>
                  <Text
                    style={[
                      theme.typography.bodySmall,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Menu Section */}
      <Card variant="elevated" style={{ marginBottom: theme.spacing.base }}>
        <View style={{ padding: theme.spacing.base }}>
          {menuItems.map((item, index) => (
            <Card
              key={item.screen}
              variant="filled"
              onPress={() => navigation.navigate(item.screen)}
              style={{
                marginBottom:
                  index < menuItems.length - 1 ? theme.spacing.sm : 0,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: theme.spacing.base,
                }}
              >
                <Icon
                  name={item.icon}
                  size={24}
                  color={theme.colors.primary}
                  style={{ marginRight: theme.spacing.base }}
                />
                <Text
                  style={[
                    theme.typography.bodyLarge,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {item.title}
                </Text>
                <Icon
                  name="chevron-right"
                  size={24}
                  color={theme.colors.textTertiary}
                />
              </View>
            </Card>
          ))}
        </View>
      </Card>

      {/* Logout Button */}
      <View style={{ paddingHorizontal: theme.spacing.base }}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          icon="logout"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
  },
});

export default ProfileScreen;
