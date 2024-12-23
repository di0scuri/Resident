import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import EventsResidents from '../screens/EventsResidents';
import EventOverview from '../screens/EventOverview';
import Notifications from '../screens/Notification';
import NotificationDetails from '../screens/NotificationDetails';
import SubmitRequirements from '../screens/SubmitRequirements'; // SubmitRequirements Screen

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Events
function EventsStackNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#7B0A0A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="EventsList"
        component={EventsResidents}
        options={{
          title: 'Events',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons
                name="menu"
                size={28}
                color="#FFFFFF"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="EventOverview"
        component={EventOverview}
        options={{ title: 'Event Overview' }}
      />
      <Stack.Screen
        name="SubmitRequirements"
        component={SubmitRequirements}
        options={{ title: 'Submit Requirements' }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator for Notifications
function NotificationsStackNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#7B0A0A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="NotificationList"
        component={Notifications}
        options={{
          title: 'Notifications',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons
                name="menu"
                size={28}
                color="#FFFFFF"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="NotificationDetails"
        component={NotificationDetails}
        options={{ title: 'Notification Details' }}
      />
    </Stack.Navigator>
  );
}

// Main Drawer Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#7B0A0A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Drawer.Screen
          name="Events"
          component={EventsStackNavigator}
          options={{ title: 'Events' }}
        />
        <Drawer.Screen
          name="Notifications"
          component={NotificationsStackNavigator}
          options={{ title: 'Notifications' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
