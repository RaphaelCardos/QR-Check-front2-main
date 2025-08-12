#!/usr/bin/env python3
"""
Script para criar o arquivo .env automaticamente
"""

import os

def create_env_file():
    """Cria o arquivo .env com as configurações do PostgreSQL"""
    
    env_content = """DATABASE_URL_SYNC=postgresql://postgres:ifes*lableds_2025@localhost:5432/qrcheck
DATABASE_URL_ASYNC=postgresql+asyncpg://postgres:ifes*lableds_2025@localhost:5432/qrcheck
SECRET_KEY=qrcheck-secret-key-2025-very-secure-and-long-enough-for-jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
"""
    
    try:
        with open('.env', 'w', encoding='utf-8') as f:
            f.write(env_content)
        
        print("✅ Arquivo .env criado com sucesso!")
        print("📝 Configurações:")
        print("   - Banco: PostgreSQL 17")
        print("   - Nome: qrcheck")
        print("   - Porta: 5432")
        print("   - Usuário: postgres")
        print("   - Senha: ifes*lableds_2025")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar arquivo .env: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Criando arquivo .env...")
    create_env_file() 