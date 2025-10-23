import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VenuesScreen from '@features/venues/screens/VenuesScreen';
import VenueDetailScreen from '@features/venues/screens/VenueDetailScreen';
import CreateBookingScreen from '@features/venues/screens/CreateBookingScreen';

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
