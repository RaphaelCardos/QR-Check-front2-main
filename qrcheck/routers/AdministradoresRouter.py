import uuid
from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from qrcheck.database import get_session_async
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.ParticipanteModels import Participante
from qrcheck.schemas.AdministradoresSchema import (
    AdministradorSchema,
    AdministradorSchemaPublic,
)
from qrcheck.security import (
    get_current_user,
    get_senha_hash,
)

router = APIRouter(prefix="/admin", tags=["🧙‍♂️ Administradores"])


# Annotated é uma classe usada para adicionar metadados (ou atributos) a tipos de dados.  # noqa: E501
T_Session = Annotated[AsyncSession, Depends(get_session_async)]
T_CurrentAdmin = Annotated[Administrador, Depends(get_current_user)]


# Criado o GET (Listagem) de administrador.
@router.get("/administradores", status_code=HTTPStatus.OK, response_model=List[AdministradorSchemaPublic])
async def lista_administradores(session: T_Session, current_admin: T_CurrentAdmin):
    result = await session.execute(select(Administrador))  # Aguarde a execução da consulta
    lista_administradores = result.scalars().all()  # Não precisa de 'await' aqui, pois 'scalars()' já resolve o resultado
    return lista_administradores


# Criado o GET (Perfil) de administrador.
@router.get(
    "/meu-painel",
    status_code=HTTPStatus.OK,
    response_model=AdministradorSchemaPublic,
)
async def acessa_perfil(session: T_Session, current_admin: T_CurrentAdmin):
    administrador = await session.scalar(select(Administrador).where(Administrador.id == current_admin.id))
    if not administrador:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Administrador não encontrado.",
        )
    return administrador


# Criado o POST (Cadastro) de administradores.
@router.post(
    "/cadastro",
    status_code=HTTPStatus.CREATED,
    response_model=AdministradorSchemaPublic,
)
async def cadastra_administrador(administrador: AdministradorSchema, session: T_Session, current_admin: T_CurrentAdmin):
    # Verifica se o e-mail já pertence a um administrador
    if await session.scalar(select(Administrador).where(Administrador.email == administrador.email)):  # noqa: E501
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Email já cadastrado.",
        )

    # Verifica se possui algum participante com o mesmo e-mail que o administrador está tentando
    # cadastrar.
    db_participante = await session.scalar(
        select(Participante).where(Participante.email == administrador.email)  # noqa: E501
    )

    if db_participante:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Email já cadastrado.",
        )

    db_administrador = Administrador(
        id=uuid.uuid4(),  # Gera um UUID
        nome=administrador.nome,
        email=administrador.email,
        senha=get_senha_hash(administrador.senha),  # Gera o hash da senha
        data_criacao=None,
    )

    session.add(db_administrador)
    await session.commit()
    await session.refresh(db_administrador)

    return db_administrador
