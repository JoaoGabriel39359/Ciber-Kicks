import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Application Context Providers
import { CartProvider } from './src/contexts/CartContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';

// Main Navigation Routes Manager
import { AppRoutes } from './src/routes/AppRoutes';

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <AppRoutes />
        </NavigationContainer>
      </FavoritesProvider>
    </CartProvider>
  );
}