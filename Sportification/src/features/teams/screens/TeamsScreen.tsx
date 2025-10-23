import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTeamsScreen } from '../hooks';
import { useTheme } from '../../../theme';
import { ListScreenTemplate } from '@shared/components/templates';
import { Card, Avatar } from '@shared/components/organisms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TeamsScreenProps {
  navigation: any;
}

const TeamsScreen: React.FC<TeamsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const props = useTeamsScreen(navigation);

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTeamsScreen } from '../hooks';
import { useTheme } from '../../../theme';
import { ListScreenTemplate } from '@shared/components/templates';
import { Card, Avatar } from '@shared/components/organisms';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TeamsScreenProps {
  navigation: any;
}

const TeamsScreen: React.FC<TeamsScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const props = useTeamsScreen(navigation);

  const renderTeamItem = (item: any, index: number) => {
    const captain = item.members.find((m: any) => m.role === 'captain');
    
    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <Card
          onPress={() => props.onTeamPress(item.id)}
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

  return (
    <ListScreenTemplate
      title="Teams"
      items={props.teams}
      renderItem={renderTeamItem}
      isLoading={props.isLoading}
      error={props.error}
      onRefresh={props.onRefresh}
      onAddNew={props.onCreateTeam}
      emptyMessage="No teams found"
      searchPlaceholder="Search teams..."
    />
  );
};

const styles = StyleSheet.create({
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
