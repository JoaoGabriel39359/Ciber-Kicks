import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Produto } from '../@types/produto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@cyber_kicks:cart';

export interface ItemCarrinho {
    produto: Produto;
    tamanho: number;
    quantidade: number;
}

interface CartContextType {
    itens: ItemCarrinho[];
    adicionarAoCarrinho: (produto: Produto, tamanho: number) => void;
    removerItem: (produtoId: string | number, tamanho: number) => void;
    atualizarQuantidade: (produtoId: string | number, tamanho: number, novaQuantidade: number) => void;
    limparCarrinho: () => void;
    totalItens: number;
    valorTotal: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
    const [itens, setItens] = useState<ItemCarrinho[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Carrega o carrinho salvo no celular ao abrir o App
    useEffect(() => {
        async function loadStorageData() {
            try {
                const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
                if (storedCart) {
                    setItens(JSON.parse(storedCart));
                }
            } catch (error) {
                console.log('Erro ao carregar o carrinho do armazenamento:', error);
            } finally {
                setIsLoaded(true);
            }
        }
        loadStorageData();
    }, []);

    // 2. Salva o carrinho no celular sempre que houver alterações
    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itens)).catch((err) =>
                console.log('Erro ao salvar o carrinho no armazenamento:', err)
            );
        }
    }, [itens, isLoaded]);

    const adicionarAoCarrinho = (produto: Produto, tamanho: number) => {
        setItens((itensAtuais) => {
            const itemExistente = itensAtuais.find(
                (item) => item.produto.id === produto.id && item.tamanho === tamanho
            );

            if (itemExistente) {
                return itensAtuais.map((item) =>
                    item.produto.id === produto.id && item.tamanho === tamanho
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            }

            return [...itensAtuais, { produto, tamanho, quantidade: 1 }];
        });
    };

    const removerItem = (produtoId: string | number, tamanho: number) => {
        setItens((itensAtuais) =>
            itensAtuais.filter(
                (item) => !(item.produto.id === produtoId && item.tamanho === tamanho)
            )
        );
    };

    const atualizarQuantidade = (produtoId: string | number, tamanho: number, novaQuantidade: number) => {
        if (novaQuantidade <= 0) {
            removerItem(produtoId, tamanho);
            return;
        }

        setItens((itensAtuais) =>
            itensAtuais.map((item) =>
                item.produto.id === produtoId && item.tamanho === tamanho
                    ? { ...item, quantidade: novaQuantidade }
                    : item
            )
        );
    };

    const limparCarrinho = () => {
        setItens([]);
    };

    const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

    const valorTotal = itens.reduce(
        (acc, item) => acc + Number(item.produto.preco) * item.quantidade,
        0
    );

    return (
        <CartContext.Provider
            value={{
                itens,
                adicionarAoCarrinho,
                removerItem,
                atualizarQuantidade,
                limparCarrinho,
                totalItens,
                valorTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart precisa ser usado dentro de um CartProvider');
    }
    return context;
}