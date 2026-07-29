import axios from 'axios';
import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
    baseURL: API_URL,
});

export const obterProdutos = async () => {
    const resposta = await api.get('/produtos');
    return resposta.data;
};

export interface PayloadPedido {
    itens: {
        produto_id: string;
        quantidade: number;
        tamanho: number;
        preco_unitario: number;
    }[];
    valor_total: number;
}

export const enviarPedido = async (dadosPedido: PayloadPedido) => {
    const resposta = await api.post('/pedidos', dadosPedido);
    return resposta.data;
};

export async function getMeusPedidos() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('Usuário não autenticado');
    }

    const resposta = await api.get('/pedidos', {
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
    });

    return resposta.data;
}