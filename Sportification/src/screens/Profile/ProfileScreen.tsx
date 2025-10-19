import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { useGetUserStatsQuery, useGetUserAchievementsQuery } from '../../store/api/authApi';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../store/slices/authSlice';
import { apiService } from '../../services/api';
import { socketService } from '../../services/socketService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
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
      <View style={styles.container}>
        <Text>Please login</Text>
      </View>
    );
  }

  const stats = statsData?.data;
  const achievements = achievementsData?.data || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.profile.bio && (
          <Text style={styles.bio}>{user.profile.bio}</Text>
        )}
      </View>

      {statsLoading ? (
        <LoadingSpinner />
      ) : stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.matchesPlayed}</Text>
              <Text style={styles.statLabel}>Matches Played</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.matchesWon}</Text>
              <Text style={styles.statLabel}>Matches Won</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.tournamentsPlayed}</Text>
              <Text style={styles.statLabel}>Tournaments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.tournamentsWon}</Text>
              <Text style={styles.statLabel}>Tournament Wins</Text>
            </View>
          </View>
        </View>
      )}

      {!achievementsLoading && achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementName}>{achievement.name}</Text>
                <Text style={styles.achievementDesc}>
                  {achievement.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Friends')}
        >
          <Text style={styles.menuText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text style={styles.menuText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
      />
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    margin: 16,
    marginTop: 8,
  },
});

export default ProfileScreen;
