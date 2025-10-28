import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '@features/profile/screens/ProfileScreen';
import EditProfileScreen from '@features/profile/screens/EditProfileScreen';
import ChangePasswordScreen from '@features/profile/screens/ChangePasswordScreen';
import FriendsScreen from '@features/profile/screens/FriendsScreen';
import NotificationsScreen from '@features/notifications/screens/NotificationsScreen';
import AccessibilitySettingsScreen from '@features/profile/screens/AccessibilitySettingsScreen';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
      <Stack.Screen 
        name="Friends" 
        component={FriendsScreen}
        options={{ title: 'Friends' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen 
        name="AccessibilitySettings" 
        component={AccessibilitySettingsScreen}
        options={{ title: 'Accessibility' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
