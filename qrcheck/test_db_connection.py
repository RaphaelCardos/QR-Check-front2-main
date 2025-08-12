#!/usr/bin/env python3
"""
Script para testar a conexão com o banco de dados PostgreSQL
"""

import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Carrega o arquivo .env
load_dotenv()

async def test_async_connection():
    """Testa a conexão assíncrona com o banco"""
    try:
        database_url = os.getenv('DATABASE_URL_ASYNC')
        if not database_url:
            print("❌ DATABASE_URL_ASYNC não configurada")
            return False
            
        print(f"🔍 Testando conexão assíncrona...")
        print(f"📊 URL: {database_url.split('@')[1] if '@' in database_url else 'URL mascarada'}")
        
        engine = create_async_engine(database_url, echo=False)
        
        async with engine.begin() as conn:
            result = await conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"✅ Conexão assíncrona OK - PostgreSQL {version.split(',')[0]}")
            
        await engine.dispose()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão assíncrona: {e}")
        return False

def test_sync_connection():
    """Testa a conexão síncrona com o banco"""
    try:
        database_url = os.getenv('DATABASE_URL_SYNC')
        if not database_url:
            print("❌ DATABASE_URL_SYNC não configurada")
            return False
            
        print(f"🔍 Testando conexão síncrona...")
        print(f"📊 URL: {database_url.split('@')[1] if '@' in database_url else 'URL mascarada'}")
        
        engine = create_engine(database_url, echo=False)
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"✅ Conexão síncrona OK - PostgreSQL {version.split(',')[0]}")
            
        engine.dispose()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão síncrona: {e}")
        return False

async def main():
    print("🔍 Testando conexões com o banco de dados...")
    print("=" * 60)
    
    # Testa conexão síncrona
    sync_ok = test_sync_connection()
    
    print()
    
    # Testa conexão assíncrona
    async_ok = await test_async_connection()
    
    print("=" * 60)
    
    if sync_ok and async_ok:
        print("✅ Todas as conexões com o banco estão funcionando!")
        print("🚀 O backend deve funcionar corretamente.")
    else:
        print("❌ Há problemas com as conexões do banco de dados.")
        print("\n🔧 Possíveis soluções:")
        print("1. Verifique se o PostgreSQL está rodando")
        print("2. Verifique as credenciais no arquivo .env")
        print("3. Verifique se o banco de dados existe")
        print("4. Verifique se as dependências estão instaladas:")
        print("   pip install psycopg2-binary asyncpg")

if __name__ == "__main__":
    asyncio.run(main()) 