import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VenuesScreen from '../screens/Venues/VenuesScreen';
import VenueDetailScreen from '../screens/Venues/VenueDetailScreen';
import CreateBookingScreen from '../screens/Venues/CreateBookingScreen';

const Stack = createStackNavigator();

const VenuesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="VenuesList" 
        component={VenuesScreen}
        options={{ title: 'Venues', headerShown: false }}
      />
      <Stack.Screen 
        name="VenueDetail" 
        component={VenueDetailScreen}
        options={{ title: 'Venue Details' }}
      />
      <Stack.Screen 
        name="CreateBooking" 
        component={CreateBookingScreen}
        options={{ title: 'Create Booking' }}
      />
    </Stack.Navigator>
  );
};

export default VenuesNavigator;
