import axios from 'axios';

const API_URL = 'http://192.168.29.211:8000';

export const api = axios.create({
    baseURL: API_URL,
});

export interface Produto {
    id: string | number;
    nome: string;
    preco: number;
    imagem: string[];
    marca?: string;
    descricao?: string;
    categoria?: string;
}

export const obterProdutos = async () => {
    const resposta = await api.get('/produtos');
    return resposta.data;
};

export interface PayloadPedido {
    itens: {
        produto_id: string;
        quantidade: number;
        tamanho: number;
    }[];
    total: number;
}

export const enviarPedido = async (dadosPedido: PayloadPedido) => {
    const resposta = await api.post('/pedidos', dadosPedido);
    return resposta.data;
};