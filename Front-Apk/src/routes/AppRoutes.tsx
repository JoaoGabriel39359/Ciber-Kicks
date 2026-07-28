import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { DetailsScreen } from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator();

export function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* BottomTabNavigator handles bottom tab navigation */}
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

            {/* Details screen opens over the bottom tab navigator */}
            <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    );
}