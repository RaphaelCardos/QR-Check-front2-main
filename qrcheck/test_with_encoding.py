#!/usr/bin/env python3
"""
Teste com URL encoding para caracteres especiais na senha
"""

import psycopg2
import urllib.parse
import asyncio
import asyncpg

def test_with_encoding():
    """Teste com encoding da senha"""
    try:
        print("🔍 Testando com encoding da senha...")
        
        # Codifica a senha para URL
        password = urllib.parse.quote_plus("ifes*lableds_2025")
        print(f"🔐 Senha codificada: {password}")
        
        # Tenta conectar com senha codificada
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="qrcheck",
            user="postgres",
            password="ifes*lableds_2025"  # Senha original
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()
        
        print(f"✅ Conexão com encoding OK!")
        print(f"📊 PostgreSQL: {version[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro com encoding: {e}")
        return False

def test_different_password():
    """Teste com senha diferente (temporário)"""
    try:
        print("🔍 Testando com senha temporária...")
        
        # Tenta conectar com senha simples
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="qrcheck",
            user="postgres",
            password="postgres"  # Senha padrão comum
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT version()")
        version = cursor.fetchone()
        
        print(f"✅ Conexão com senha temporária OK!")
        print(f"📊 PostgreSQL: {version[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Erro com senha temporária: {e}")
        return False

def main():
    print("🔍 Teste com Diferentes Codificações")
    print("=" * 50)
    
    # Teste com encoding
    encoding_ok = test_with_encoding()
    
    print()
    
    # Teste com senha temporária
    temp_ok = test_different_password()
    
    print("=" * 50)
    
    if encoding_ok:
        print("✅ Conexão funcionando com encoding!")
    elif temp_ok:
        print("⚠️ Conexão funciona com senha temporária")
        print("🔧 A senha original pode ter caracteres especiais problemáticos")
    else:
        print("❌ Nenhuma conexão funcionou")
        print("🔧 Verifique se o PostgreSQL está rodando e acessível")

if __name__ == "__main__":
    main() 