import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { CartScreen } from '../screens/CartScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useCart } from '../contexts/CartContext';

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
    const { totalItens } = useCart();
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#00F0FF',
                tabBarInactiveTintColor: '#666677',
                tabBarLabelStyle: styles.tabLabel,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: Platform.OS === 'ios' ? 60 + insets.bottom : 65,
                        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
                    },
                ],
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Destaques',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={20} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="SearchTab"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Buscar',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="search-outline" size={20} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="FavoritosTab"
                component={FavoritesScreen}
                options={{
                    tabBarLabel: 'Favoritos',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="heart-outline" size={20} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="CartTab"
                component={CartScreen}
                options={{
                    tabBarLabel: 'Carrinho',
                    tabBarBadge: totalItens > 0 ? totalItens : undefined,
                    tabBarBadgeStyle: styles.badgeStyle,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="bag-handle-outline" size={20} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="PerfilTab"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={20} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#050508',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
        paddingTop: 8,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    badgeStyle: {
        backgroundColor: '#00F0FF',
        color: '#000000',
        fontSize: 10,
        fontWeight: '900',
    },
});