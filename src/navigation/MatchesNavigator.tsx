import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MatchesScreen from '@features/matches/screens/MatchesScreen';
import MatchDetailScreen from '@features/matches/screens/MatchDetailScreen';
import CreateMatchScreen from '@features/matches/screens/CreateMatchScreen';

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
