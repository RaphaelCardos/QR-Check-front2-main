#!/usr/bin/env python3
"""
Script para iniciar o backend com verificações prévias
"""

import os
import sys
import uvicorn
from dotenv import load_dotenv

# Carrega o arquivo .env
load_dotenv()

def check_environment():
    """Verifica se as variáveis de ambiente estão configuradas"""
    print("🔍 Verificando configurações...")
    
    required_vars = [
        'DATABASE_URL_SYNC',
        'DATABASE_URL_ASYNC',
        'SECRET_KEY',
        'ALGORITHM',
        'ACCESS_TOKEN_EXPIRE_MINUTES',
        'REFRESH_TOKEN_EXPIRE_DAYS'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Variáveis de ambiente faltando:")
        for var in missing_vars:
            print(f"   - {var}")
        
        print("\n📝 Crie um arquivo .env na pasta qrcheck com:")
        print("DATABASE_URL_SYNC=postgresql://usuario:senha@localhost:5432/nome_do_banco")
        print("DATABASE_URL_ASYNC=postgresql+asyncpg://usuario:senha@localhost:5432/nome_do_banco")
        print("SECRET_KEY=sua-chave-secreta-aqui")
        print("ALGORITHM=HS256")
        print("ACCESS_TOKEN_EXPIRE_MINUTES=30")
        print("REFRESH_TOKEN_EXPIRE_DAYS=7")
        return False
    
    print("✅ Todas as variáveis de ambiente configuradas!")
    return True

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    print("🔍 Verificando dependências...")
    
    try:
        import fastapi
        print("✅ FastAPI instalado")
    except ImportError:
        print("❌ FastAPI não instalado")
        print("   pip install fastapi uvicorn")
        return False
    
    try:
        import sqlalchemy
        print("✅ SQLAlchemy instalado")
    except ImportError:
        print("❌ SQLAlchemy não instalado")
        print("   pip install sqlalchemy")
        return False
    
    try:
        import psycopg2
        print("✅ psycopg2 instalado")
    except ImportError:
        print("❌ psycopg2 não instalado")
        print("   pip install psycopg2-binary")
        return False
    
    try:
        import asyncpg
        print("✅ asyncpg instalado")
    except ImportError:
        print("❌ asyncpg não instalado")
        print("   pip install asyncpg")
        return False
    
    return True

def main():
    print("🚀 Iniciando QRCheck Backend...")
    print("=" * 50)
    
    # Verifica configurações
    if not check_environment():
        print("\n❌ Configurações inválidas. Corrija e tente novamente.")
        sys.exit(1)
    
    print()
    
    # Verifica dependências
    if not check_dependencies():
        print("\n❌ Dependências faltando. Instale e tente novamente.")
        sys.exit(1)
    
    print()
    print("✅ Todas as verificações passaram!")
    print("🚀 Iniciando servidor...")
    print("📱 Frontend: http://localhost:5173")
    print("🔧 Backend: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("⏹️  Pressione Ctrl+C para parar")
    print("=" * 50)
    
    try:
        uvicorn.run(
            "app:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Servidor parado pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro ao iniciar servidor: {e}")
        print("🔧 Verifique se a porta 8000 está livre")

if __name__ == "__main__":
    main() 