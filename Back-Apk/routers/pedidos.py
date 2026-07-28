from fastapi import APIRouter
from schemas.pedido import PedidoSchema

router = APIRouter(
    prefix="/pedidos",
    tags=["Orders"]
)

@router.post("/")
def criar_pedido(pedido: PedidoSchema):
    print(f"📦 New order received via API Router! Total: R$ {pedido.total:.2f}")
    
    return {
        "success": True,
        "message": "Order received and validated successfully!",
        "received_items": len(pedido.itens)
    }