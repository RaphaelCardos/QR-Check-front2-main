#!/usr/bin/env python3
"""
Script para corrigir o arquivo .env com codificação adequada
"""

import os

def fix_env_file():
    """Corrige o arquivo .env com codificação adequada"""
    
    # Configurações com escape adequado para caracteres especiais
    env_content = """DATABASE_URL_SYNC=postgresql://postgres:ifes*lableds_2025@localhost:5432/qrcheck
DATABASE_URL_ASYNC=postgresql+asyncpg://postgres:ifes*lableds_2025@localhost:5432/qrcheck
SECRET_KEY=qrcheck-secret-key-2025-very-secure-and-long-enough-for-jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
"""
    
    try:
        # Remove o arquivo existente se houver
        if os.path.exists('.env'):
            os.remove('.env')
            print("🗑️ Arquivo .env anterior removido")
        
        # Cria o novo arquivo com codificação UTF-8
        with open('.env', 'w', encoding='utf-8', newline='\n') as f:
            f.write(env_content)
        
        print("✅ Arquivo .env corrigido com sucesso!")
        print("📝 Configurações atualizadas:")
        print("   - Banco: PostgreSQL 17")
        print("   - Nome: qrcheck")
        print("   - Porta: 5432")
        print("   - Usuário: postgres")
        print("   - Senha: ifes*lableds_2025")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao corrigir arquivo .env: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Corrigindo arquivo .env...")
    fix_env_file() 