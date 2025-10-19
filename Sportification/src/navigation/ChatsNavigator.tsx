import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatsScreen from '../screens/Chat/ChatsScreen';
import ChatDetailScreen from '../screens/Chat/ChatDetailScreen';

const Stack = createStackNavigator();

const ChatsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChatsList" 
        component={ChatsScreen}
        options={{ title: 'Chats', headerShown: false }}
      />
      <Stack.Screen 
        name="ChatDetail" 
        component={ChatDetailScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
};

export default ChatsNavigator;
