import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MatchesScreen from '../screens/Matches/MatchesScreen';
import TournamentsScreen from '../screens/Tournaments/TournamentsScreen';
import TeamsNavigator from './TeamsNavigator';
import VenuesScreen from '../screens/Venues/VenuesScreen';
import ChatsScreen from '../screens/Chat/ChatsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

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
        component={MatchesScreen}
        options={{
          title: 'Matches',
        }}
      />
      <Tab.Screen
        name="Tournaments"
        component={TournamentsScreen}
        options={{
          title: 'Tournaments',
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
        component={VenuesScreen}
        options={{
          title: 'Venues',
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          title: 'Chats',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
