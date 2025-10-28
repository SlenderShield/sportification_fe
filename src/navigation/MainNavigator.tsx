import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Matches"
        component={MatchesNavigator}
        options={{
          title: 'Matches',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="soccer-field" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tournaments"
        component={TournamentsNavigator}
        options={{
          title: 'Tournaments',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Teams"
        component={TeamsNavigator}
        options={{
          title: 'Teams',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Venues"
        component={VenuesNavigator}
        options={{
          title: 'Venues',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="map-marker" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsNavigator}
        options={{
          title: 'Chats',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="message" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
