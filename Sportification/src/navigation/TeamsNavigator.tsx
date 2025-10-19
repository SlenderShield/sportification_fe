import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeamsScreen from '../screens/Teams/TeamsScreen';
import TeamDetailScreen from '../screens/Teams/TeamDetailScreen';
import CreateTeamScreen from '../screens/Teams/CreateTeamScreen';

const Stack = createStackNavigator();

const TeamsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TeamsList" 
        component={TeamsScreen}
        options={{ title: 'Teams', headerShown: false }}
      />
      <Stack.Screen 
        name="TeamDetail" 
        component={TeamDetailScreen}
        options={{ title: 'Team Details' }}
      />
      <Stack.Screen 
        name="CreateTeam" 
        component={CreateTeamScreen}
        options={{ title: 'Create Team' }}
      />
    </Stack.Navigator>
  );
};

export default TeamsNavigator;
