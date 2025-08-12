from typing import Annotated
import uuid

from fastapi import Depends
from sqlalchemy import select
from qrcheck.security import get_senha_hash
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.database import get_session_async
from sqlalchemy.ext.asyncio import AsyncSession

#TODO TERMINAR O CRUD DO ADMINISTRADOR
#TODO TERMINAR DE IMPLEMENTAR MEDIDAS DE SEGURANÇA (TOTP) PARA A CRIAÇÃO DO ADMINISTRADOR

T_Session = Annotated[AsyncSession, Depends(get_session_async)]

async def create_superadmin(session: T_Session):
    """
    Função para criar um superadministrador no banco de dados.
    """
    # Verifica se já existe um superadministrador
    superadmin_existente = await session.execute(
        select(Administrador).where(Administrador.email == ""))
    if superadmin_existente.scalars().first():
        print("Superadministrador já existe. Nenhuma ação foi realizada.")
        return
    else:
        print("Criando superadministrador...")
    # Cria o superadministrador
    senha_hash = get_senha_hash("senha_do_admin")
    admin = Administrador(
        id=uuid.uuid4(),
        nome="Admin",
        email="admin@exemplo.com",
        senha=senha_hash,
    )
    session.add(admin)
    session.commit()