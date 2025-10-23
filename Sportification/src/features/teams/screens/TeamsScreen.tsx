import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGetTeamsQuery } from '../../store/api/teamApi';
import { useTheme } from '../../theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Card, FAB, Avatar, Badge, EmptyState } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TeamsScreenProps {
  navigation: any;
}

const TeamsScreen: React.FC<TeamsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetTeamsQuery({ page: 1, limit: 10 });
  const teams = data?.data?.items || [];

  const renderTeamItem = ({ item, index }: any) => {
    const captain = item.members.find((m: any) => m.role === 'captain');
    
    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <Card
          onPress={() => navigation.navigate('TeamDetail', { teamId: item.id })}
          style={{ marginBottom: theme.spacing.md }}
          elevation="md"
        >
          <View style={{ padding: theme.spacing.base }}>
            <View style={styles.header}>
              <Avatar
                name={item.name}
                size="large"
                variant="rounded"
                backgroundColor={theme.colors.secondary}
                style={{ marginRight: theme.spacing.md }}
              />
              <View style={styles.info}>
                <Text
                  style={[
                    theme.typography.titleLarge,
                    { color: theme.colors.text, marginBottom: theme.spacing.xs },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="soccer"
                    size={16}
                    color={theme.colors.secondary}
                    style={{ marginRight: theme.spacing.xs }}
                  />
                  <Text
                    style={[
                      theme.typography.bodyMedium,
                      { color: theme.colors.secondary, fontWeight: '600' },
                    ]}
                  >
                    {item.sport}
                  </Text>
                </View>
              </View>
            </View>

            {item.description && (
              <Text
                style={[
                  theme.typography.bodySmall,
                  {
                    color: theme.colors.textSecondary,
                    marginTop: theme.spacing.sm,
                  },
                ]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}

            <View
              style={[
                styles.footer,
                {
                  marginTop: theme.spacing.md,
                  paddingTop: theme.spacing.md,
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.divider,
                },
              ]}
            >
              <View style={styles.footerItem}>
                <Icon
                  name="account-group"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={{ marginRight: theme.spacing.xs }}
                />
                <Text
                  style={[
                    theme.typography.bodySmall,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.members.length}
                  {item.maxMembers ? ` / ${item.maxMembers}` : ''} members
                </Text>
              </View>

              {captain && (
                <View style={styles.footerItem}>
                  <Icon
                    name="crown"
                    size={16}
                    color={theme.colors.warning}
                    style={{ marginRight: theme.spacing.xs }}
                  />
                  <Text
                    style={[
                      theme.typography.labelSmall,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {captain.username}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };

  if (isLoading && teams.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={teams}
        renderItem={renderTeamItem}
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
            icon="account-group-outline"
            title="No teams found"
            message="Create your first team to get started"
          />
        }
      />
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CreateTeam')}
        variant="secondary"
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
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TeamsScreen;
