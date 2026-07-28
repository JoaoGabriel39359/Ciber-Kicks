import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Produto } from '../@types/produto';

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
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}