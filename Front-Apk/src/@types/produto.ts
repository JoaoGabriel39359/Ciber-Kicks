// src/@types/index.ts

export interface Produto {
    id: string | number;
    nome: string;
    marca: string;
    preco: number;
    categoria?: string;
    descricao?: string;
    tamanhos?: number[];
    imagem: string[];
    destaque?: boolean;
}

export interface CartItem {
    produto: Produto;
    tamanhoSelecionado: number;
    quantidade: number;
}

export interface UserProfile {
    id: string;
    email: string;
    nome?: string;
}