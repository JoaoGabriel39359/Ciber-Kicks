export interface Produto {
    id: string;
    nome: string;
    preco: number;
    imagem: string[];
    tamanhos?: string[];
    descricao?: string;
    categoria?: string;
    marca?: string;
}