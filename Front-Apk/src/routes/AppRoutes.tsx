import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { DetailsScreen } from '../screens/DetailsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OrdersScreen } from '../screens/profile/OrdersScreen';
import { AddressesScreen } from '../screens/profile/AddressesScreen';
import { PaymentsScreen } from '../screens/profile/PaymentsScreen';
import { HelpScreen } from '../screens/profile/HelpScreen';

// Settings
import { SettingsScreen } from '../screens/profile/settings/SettingsScreen';
import { SecuritySettingsScreen } from '../screens/profile/settings/SecuritySettingsScreen';
import { NotificationSettingsScreen } from '../screens/profile/settings/NotificationSettingsScreen';
import { AccountSettingsScreen } from '../screens/profile/settings/AccountSettingsScreen';

const Stack = createNativeStackNavigator();

export function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="Addresses" component={AddressesScreen} />
            <Stack.Screen name="Payments" component={PaymentsScreen} />
            <Stack.Screen name="HelpScreen" component={HelpScreen} />

            {/* Settings */}
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
            <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
        </Stack.Navigator>
    );
}