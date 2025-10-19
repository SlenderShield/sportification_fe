import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
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

interface FriendsScreenProps {
  navigation: any;
}

const FriendsScreen: React.FC<FriendsScreenProps> = ({ navigation }) => {
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

  const renderFriend = ({ item }: any) => (
    <View style={styles.friendCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
        <Text style={styles.friendEmail}>{item.email}</Text>
      </View>
      <Button
        title="Remove"
        onPress={() => handleRemoveFriend(item.id, item.username)}
        variant="outline"
        style={styles.removeButton}
        textStyle={styles.removeButtonText}
      />
    </View>
  );

  const renderSearchResult = ({ item }: any) => {
    const isFriend = friends.some((f: any) => f.id === item.id);
    const isMe = item.id === user?.id;

    if (isMe) return null;

    return (
      <View style={styles.friendCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.username}</Text>
          <Text style={styles.friendEmail}>{item.email}</Text>
        </View>
        {!isFriend ? (
          <Button
            title="Add"
            onPress={() => handleAddFriend(item.id, item.username)}
            style={styles.addButton}
            textStyle={styles.addButtonText}
          />
        ) : (
          <View style={styles.friendBadge}>
            <Text style={styles.friendBadgeText}>Friend</Text>
          </View>
        )}
      </View>
    );
  };

  if (loadingFriends && friends.length === 0 && !searchMode) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search users by username or email..."
          onFocus={() => setSearchMode(true)}
          onBlur={() => {
            if (!searchQuery) setSearchMode(false);
          }}
        />
        {searchMode && (
          <Button
            title="Cancel"
            onPress={() => {
              setSearchQuery('');
              setSearchMode(false);
            }}
            variant="outline"
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        )}
      </View>

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
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No users found</Text>
                </View>
              ) : null
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
            <RefreshControl refreshing={loadingFriends} onRefresh={refetchFriends} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No friends yet</Text>
              <Text style={styles.emptySubtext}>Search for users to add friends</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  cancelButtonText: {
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  removeButtonText: {
    fontSize: 14,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 32,
  },
  addButtonText: {
    fontSize: 14,
  },
  friendBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  friendBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default FriendsScreen;
