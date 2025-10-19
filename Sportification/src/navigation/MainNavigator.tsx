import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MatchesNavigator from './MatchesNavigator';
import TournamentsNavigator from './TournamentsNavigator';
import TeamsNavigator from './TeamsNavigator';
import VenuesNavigator from './VenuesNavigator';
import ChatsNavigator from './ChatsNavigator';
import ProfileNavigator from './ProfileNavigator';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Matches"
        component={MatchesNavigator}
        options={{
          title: 'Matches',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Tournaments"
        component={TournamentsNavigator}
        options={{
          title: 'Tournaments',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Teams"
        component={TeamsNavigator}
        options={{
          title: 'Teams',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Venues"
        component={VenuesNavigator}
        options={{
          title: 'Venues',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsNavigator}
        options={{
          title: 'Chats',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
