import os
from fastapi import APIRouter, HTTPException, Header
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/produtos",
    tags=["Products"]
)

url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(url, key)

async def get_current_user(authorization: str = Header(...)):
    """Valida o token JWT passado pelo Header Authorization"""
    try:
        token = authorization.split("Bearer ")[1]
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Token inválido ou expirado")
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Falha na autenticação")

@router.get("/")
def listar_produtos():
    try:
        resposta = supabase.table("produtos").select("*").execute()
        return resposta.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to Supabase: {str(e)}")