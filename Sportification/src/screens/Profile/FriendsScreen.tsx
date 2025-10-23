import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  useGetFriendsQuery,
  useSearchUsersQuery,
  useAddFriendMutation,
  useRemoveFriendMutation,
} from '../../store/api/userApi';
import { useAppSelector } from '../../store/hooks';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Card, Avatar, Badge, IconButton, EmptyState } from '../../components/ui';
import { useTheme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FadeInDown } from 'react-native-reanimated';

interface FriendsScreenProps {
  navigation: any;
}

const FriendsScreen: React.FC<FriendsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  const { data: friendsData, isLoading: loadingFriends, refetch: refetchFriends } = useGetFriendsQuery(user?.id || '');
  const { data: searchData, isLoading: loadingSearch } = useSearchUsersQuery(
    { query: searchQuery },
    { skip: !searchQuery || searchQuery.length < 2 }
  );
  const [addFriend, { isLoading: isAdding }] = useAddFriendMutation();
  const [removeFriend, { isLoading: isRemoving }] = useRemoveFriendMutation();

  const friends = friendsData?.data?.friends || [];
  const searchResults = searchData?.data?.items || [];
  
  const styles = createStyles(theme);

  const handleAddFriend = async (userId: string, username: string) => {
    try {
      await addFriend(userId).unwrap();
      Alert.alert('Success', `Added ${username} as a friend!`);
      refetchFriends();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Failed to add friend');
    }
  };

  const handleRemoveFriend = (userId: string, username: string) => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${username} from your friends?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFriend(userId).unwrap();
              Alert.alert('Success', `Removed ${username} from friends`);
              refetchFriends();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Failed to remove friend');
            }
          },
        },
      ]
    );
  };

  const renderFriend = ({ item, index }: any) => (
    <FadeInDown delay={index * 50} duration={400}>
      <Card style={styles.friendCard}>
        <Avatar
          name={item.username}
          size="medium"
          source={item.profilePicture ? { uri: item.profilePicture } : undefined}
        />
        <View style={styles.friendInfo}>
          <Text style={theme.typography.titleMedium}>{item.username}</Text>
          <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant }]}>
            {item.email}
          </Text>
        </View>
        <IconButton
          icon="account-minus"
          onPress={() => handleRemoveFriend(item.id, item.username)}
          variant="outlined"
          size="small"
          color={theme.colors.error}
        />
      </Card>
    </FadeInDown>
  );

  const renderSearchResult = ({ item, index }: any) => {
    const isFriend = friends.some((f: any) => f.id === item.id);
    const isMe = item.id === user?.id;

    if (isMe) return null;

    return (
      <FadeInDown delay={index * 50} duration={400}>
        <Card style={styles.friendCard}>
          <Avatar
            name={item.username}
            size="medium"
            source={item.profilePicture ? { uri: item.profilePicture } : undefined}
          />
          <View style={styles.friendInfo}>
            <Text style={theme.typography.titleMedium}>{item.username}</Text>
            <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant }]}>
              {item.email}
            </Text>
          </View>
          {!isFriend ? (
            <IconButton
              icon="account-plus"
              onPress={() => handleAddFriend(item.id, item.username)}
              variant="filled"
              size="small"
            />
          ) : (
            <Badge label="Friend" variant="success" />
          )}
        </Card>
      </FadeInDown>
    );
  };

  if (loadingFriends && friends.length === 0 && !searchMode) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search users..."
          leftIcon="account-search"
          onFocus={() => setSearchMode(true)}
          onBlur={() => {
            if (!searchQuery) setSearchMode(false);
          }}
          style={styles.searchInput}
        />
        {searchMode && (
          <Button
            title="Cancel"
            onPress={() => {
              setSearchQuery('');
              setSearchMode(false);
            }}
            variant="text"
            size="small"
          />
        )}
      </View>

      {!searchMode && (
        <View style={styles.statsContainer}>
          <Card variant="filled" style={styles.statsCard}>
            <MaterialCommunityIcons
              name="account-group"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={[theme.typography.titleLarge, styles.statsNumber]}>
              {friends.length}
            </Text>
            <Text style={[theme.typography.bodySmall, { color: theme.colors.onSurfaceVariant }]}>
              Friends
            </Text>
          </Card>
        </View>
      )}

      {searchMode ? (
        <>
          {loadingSearch && <LoadingSpinner />}
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              searchQuery.length >= 2 ? (
                <EmptyState
                  icon="account-search"
                  title="No users found"
                  message="Try a different search term"
                />
              ) : (
                <EmptyState
                  icon="magnify"
                  title=""
                  message="Search for users to add friends"
                />
              )
            }
          />
        </>
      ) : (
        <FlatList
          data={friends}
          renderItem={renderFriend}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loadingFriends}
              onRefresh={refetchFriends}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="account-group-outline"
              title="No friends yet"
              message="Search for users to add friends"
            />
          }
        />
      )}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.base,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      ...theme.elevation.level1,
    },
    searchInput: {
      flex: 1,
    },
    statsContainer: {
      padding: theme.spacing.base,
      paddingBottom: theme.spacing.sm,
    },
    statsCard: {
      alignItems: 'center',
      padding: theme.spacing.lg,
      gap: theme.spacing.xs,
    },
    statsNumber: {
      color: theme.colors.primary,
      marginTop: theme.spacing.xs,
    },
    list: {
      padding: theme.spacing.base,
      paddingTop: theme.spacing.sm,
    },
    friendCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    friendInfo: {
      flex: 1,
    },
  });

export default FriendsScreen;
