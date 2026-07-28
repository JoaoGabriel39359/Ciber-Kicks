import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Produto } from '../@types/produto';

interface FavoritesContextType {
    favoritos: Produto[];
    toggleFavorito: (produto: Produto) => void;
    isFavorito: (produtoId: string | number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({} as FavoritesContextType);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favoritos, setFavoritos] = useState<Produto[]>([]);

    const toggleFavorito = (produto: Produto) => {
        setFavoritos((atuais) => {
            const existe = atuais.some((p) => p.id === produto.id);
            if (existe) {
                return atuais.filter((p) => p.id !== produto.id);
            }
            return [...atuais, produto];
        });
    };

    const isFavorito = (produtoId: string | number) => {
        return favoritos.some((p) => p.id === produtoId);
    };

    return (
        <FavoritesContext.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}