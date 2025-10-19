import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TournamentsScreen from '../screens/Tournaments/TournamentsScreen';
import TournamentDetailScreen from '../screens/Tournaments/TournamentDetailScreen';
import CreateTournamentScreen from '../screens/Tournaments/CreateTournamentScreen';

const Stack = createStackNavigator();

const TournamentsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TournamentsList" 
        component={TournamentsScreen}
        options={{ title: 'Tournaments', headerShown: false }}
      />
      <Stack.Screen 
        name="TournamentDetail" 
        component={TournamentDetailScreen}
        options={{ title: 'Tournament Details' }}
      />
      <Stack.Screen 
        name="CreateTournament" 
        component={CreateTournamentScreen}
        options={{ title: 'Create Tournament' }}
      />
    </Stack.Navigator>
  );
};

export default TournamentsNavigator;
