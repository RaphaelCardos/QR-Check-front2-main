#!/usr/bin/env python3
"""
Script simples para testar se o backend está funcionando
"""

import asyncio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Criar uma aplicação simples para teste
app = FastAPI(title="QRCheck Test", version="0.1.0")

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Backend funcionando!", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}

if __name__ == "__main__":
    print("🚀 Iniciando servidor de teste na porta 8000...")
    print("📱 Acesse: http://localhost:8000")
    print("🔍 Health check: http://localhost:8000/health")
    print("📚 Docs: http://localhost:8000/docs")
    print("⏹️  Pressione Ctrl+C para parar")
    
    uvicorn.run(
        "test_connection:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 