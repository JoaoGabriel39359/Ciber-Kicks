from pydantic import BaseModel
from typing import List, Optional

class ProdutoSchema(BaseModel):
    id: Optional[str] = None
    nome: str
    preco: float
    descricao: str
    imagem: List[str]
    marca: Optional[str] = None
    categoria: Optional[str] = None

class ItemPedido(BaseModel):
    produto_id: str
    quantidade: int
    tamanho: int
    preco_unitario: float

class PedidoSchema(BaseModel):
    itens: List[ItemPedido]
    valor_total: float