#!/usr/bin/env python3
"""
Teste simples de conexão com PostgreSQL
"""

import psycopg2
import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Carrega o arquivo .env
load_dotenv()

def test_simple_connection():
    """Teste simples de conexão síncrona"""
    try:
        print("🔍 Testando conexão simples com PostgreSQL...")
        
        # Tenta conectar diretamente
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="qrcheck",
            user="postgres",
            password="ifes*lableds_2025"
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()
        
        print(f"✅ Conexão simples OK!")
        print(f"📊 PostgreSQL: {version[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão simples: {e}")
        return False

async def test_async_simple_connection():
    """Teste simples de conexão assíncrona"""
    try:
        print("🔍 Testando conexão assíncrona simples...")
        
        # Tenta conectar diretamente
        conn = await asyncpg.connect(
            host="localhost",
            port="5432",
            database="qrcheck",
            user="postgres",
            password="ifes*lableds_2025"
        )
        
        version = await conn.fetchval("SELECT version()")
        print(f"✅ Conexão assíncrona simples OK!")
        print(f"📊 PostgreSQL: {version}")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão assíncrona simples: {e}")
        return False

def main():
    print("🔍 Teste Simples de Conexão PostgreSQL")
    print("=" * 50)
    
    # Teste síncrono
    sync_ok = test_simple_connection()
    
    print()
    
    # Teste assíncrono
    async_ok = asyncio.run(test_async_simple_connection())
    
    print("=" * 50)
    
    if sync_ok and async_ok:
        print("✅ Conexões simples funcionando!")
        print("🚀 O problema pode estar na configuração do SQLAlchemy")
    else:
        print("❌ Problemas nas conexões básicas")
        print("🔧 Verifique:")
        print("   1. PostgreSQL está rodando na porta 5432")
        print("   2. Banco 'qrcheck' existe")
        print("   3. Usuário 'postgres' tem acesso")
        print("   4. Senha está correta")

if __name__ == "__main__":
    main() 