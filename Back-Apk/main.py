from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import produtos, pedidos

app = FastAPI(
    title="Cyber-Kicks Sales API",
    description="Backend API connected to Supabase serving the Cyber-Kicks mobile application"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(produtos.router)
app.include_router(pedidos.router)

@app.get("/")
def root():
    return {"status": "Gateway API running"}