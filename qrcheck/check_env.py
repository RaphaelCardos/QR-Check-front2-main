#!/usr/bin/env python3
"""
Script para verificar se as variáveis de ambiente estão configuradas
"""

import os
from dotenv import load_dotenv

# Carrega o arquivo .env se existir
load_dotenv()

# Variáveis necessárias
required_vars = [
    'DATABASE_URL_SYNC',
    'DATABASE_URL_ASYNC', 
    'SECRET_KEY',
    'ALGORITHM',
    'ACCESS_TOKEN_EXPIRE_MINUTES',
    'REFRESH_TOKEN_EXPIRE_DAYS'
]

print("🔍 Verificando variáveis de ambiente...")
print("=" * 50)

missing_vars = []
for var in required_vars:
    value = os.getenv(var)
    if value:
        # Mascara valores sensíveis
        if 'SECRET' in var or 'KEY' in var:
            masked_value = value[:10] + "..." if len(value) > 10 else "***"
            print(f"✅ {var}: {masked_value}")
        elif 'DATABASE_URL' in var:
            # Mostra apenas o tipo de banco
            if 'postgresql' in value.lower():
                print(f"✅ {var}: PostgreSQL configurado")
            elif 'sqlite' in value.lower():
                print(f"✅ {var}: SQLite configurado")
            else:
                print(f"✅ {var}: Outro banco configurado")
        else:
            print(f"✅ {var}: {value}")
    else:
        print(f"❌ {var}: NÃO CONFIGURADO")
        missing_vars.append(var)

print("=" * 50)

if missing_vars:
    print(f"\n❌ Faltam {len(missing_vars)} variáveis de ambiente:")
    for var in missing_vars:
        print(f"   - {var}")
    
    print("\n📝 Crie um arquivo .env na pasta qrcheck com:")
    print("DATABASE_URL_SYNC=postgresql://usuario:senha@localhost:5432/nome_do_banco")
    print("DATABASE_URL_ASYNC=postgresql+asyncpg://usuario:senha@localhost:5432/nome_do_banco")
    print("SECRET_KEY=sua-chave-secreta-aqui")
    print("ALGORITHM=HS256")
    print("ACCESS_TOKEN_EXPIRE_MINUTES=30")
    print("REFRESH_TOKEN_EXPIRE_DAYS=7")
else:
    print("\n✅ Todas as variáveis de ambiente estão configuradas!")
    print("🚀 O backend deve funcionar corretamente.") 