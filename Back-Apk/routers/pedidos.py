import os
from fastapi import APIRouter, HTTPException, Header
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional
from schemas.pedido import PedidoSchema

load_dotenv()

router = APIRouter(
    prefix="/pedidos",
    tags=["Orders"]
)

url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(url, key)


async def get_current_user(authorization: str = Header(...)):
    """Valida o token JWT do Supabase passado no Header Authorization"""
    try:
        token = authorization.split("Bearer ")[1]
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Token inválido ou expirado")
        return user_response.user
    except Exception:
        raise HTTPException(status_code=401, detail="Falha na autenticação")


@router.post("/")
def criar_pedido(pedido: PedidoSchema):
    print(f"📦 Novo pedido recebido! Total: R$ {pedido.valor_total:.2f}")
    return {
        "success": True,
        "message": "Pedido recebido e validado com sucesso!",
        "received_items": len(pedido.itens)
    }


@router.get("/")
async def listar_meus_pedidos(authorization: Optional[str] = Header(None)):
    if not authorization:
        return []
    
    user = await get_current_user(authorization)
    try:
        resposta = (
            supabase.table("pedidos")
            .select("*, itens_pedido(*, produtos(*))")
            .eq("user_id", user.id)
            .execute()
        )
        return resposta.data
    except Exception as e:
        print(f"Erro ao buscar pedidos: {str(e)}")
        return []