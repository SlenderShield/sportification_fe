import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MatchesScreen from '../screens/Matches/MatchesScreen';
import MatchDetailScreen from '../screens/Matches/MatchDetailScreen';
import CreateMatchScreen from '../screens/Matches/CreateMatchScreen';

const Stack = createStackNavigator();

const MatchesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MatchesList" 
        component={MatchesScreen}
        options={{ title: 'Matches', headerShown: false }}
      />
      <Stack.Screen 
        name="MatchDetail" 
        component={MatchDetailScreen}
        options={{ title: 'Match Details' }}
      />
      <Stack.Screen 
        name="CreateMatch" 
        component={CreateMatchScreen}
        options={{ title: 'Create Match' }}
      />
    </Stack.Navigator>
  );
};

export default MatchesNavigator;
