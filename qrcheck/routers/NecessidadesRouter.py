from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from psycopg2 import IntegrityError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from qrcheck.database import get_session_async
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.ParticipanteModels import NecessidadeEspecifica
from qrcheck.schemas.NecessidadesSchema import NecessidadeCreate, NecessidadeSchemaPrivate, NecessidadeSchemaPublic
from qrcheck.security import get_current_user

router = APIRouter(prefix="/necessidades", tags=["♿ Necessidades Específicas"])


# Annotated é uma classe usada para adicionar metadados (ou atributos) a tipos de dados.
T_Session = Annotated[AsyncSession, Depends(get_session_async)]
T_CurrentUser = Annotated[Administrador, Depends(get_current_user)]


# Necessidades Específicas: #####
# Criado o GET (Lista) de Necessidades Específicas.
@router.get(
    "/listar",
    status_code=HTTPStatus.OK,
    response_model=list[NecessidadeSchemaPublic],
)
async def lista_necessidades_especificas(session: T_Session):
    result = await session.execute(select(NecessidadeEspecifica).where(NecessidadeEspecifica.is_custom.is_(False)))
    lista_necessidades = result.scalars().all()
    return lista_necessidades


# Criado o GET (Acessa) de Necessidades Específicas.
@router.get("/{id}", status_code=HTTPStatus.OK, response_model=NecessidadeSchemaPublic)
async def acessa_necessidade(id: int, session: T_Session):
    necessidade = await session.scalar(select(NecessidadeEspecifica).where(NecessidadeEspecifica.id == id))
    if not necessidade:
        raise HTTPException(status_code=404, detail="Necessidade não encontrada.")
    return necessidade


# Criado o POST (Cadastra) de Necessidades Específicas.
@router.post(
    "/cadastrar",
    status_code=HTTPStatus.CREATED,
    response_model=NecessidadeSchemaPublic,
)
async def cadastra_necessidade_especifica(necessidade: NecessidadeCreate, session: T_Session, current_admin: T_CurrentUser):
    # Verifica se o usuário é um administrador
    if not isinstance(current_admin, Administrador):
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Requer privilégios de administrador.")

    # Se for uma lista de ocupações
    if isinstance(necessidade.nome, list):
        for nome in necessidade.nome:
            # Verifica se a ocupação já existe
            necessidade_existente = await session.scalar(select(NecessidadeEspecifica).where(NecessidadeEspecifica.nome == nome))
            if necessidade_existente:
                raise HTTPException(
                    status_code=HTTPStatus.CONFLICT, detail=f"Já existe uma necessidade específica com o nome '{nome}'.")

            try:
                # Cria a ocupação no banco de dados
                db_necessidade = NecessidadeEspecifica(nome=nome)
                session.add(db_necessidade)
                await session.commit()
                await session.refresh(db_necessidade)

            except IntegrityError:
                await session.rollback()
                raise HTTPException(
                    status_code=HTTPStatus.CONFLICT,
                    detail=f"Erro ao cadastrar necessidade específica '{nome}'. Verifique os dados fornecidos.")

        return db_necessidade

    # Se for uma única ocupação
    else:
        necessidade_existente = await session.scalar(
            select(NecessidadeEspecifica).where(NecessidadeEspecifica.nome == necessidade.nome))
    if necessidade_existente:
        raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Já existe uma ocupação com esse nome.")

    try:
        db_necessidade = NecessidadeEspecifica(nome=necessidade.nome)
        session.add(db_necessidade)
        await session.commit()
        await session.refresh(db_necessidade)

        return db_necessidade

    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Erro ao cadastrar ocupação. Verifique os dados fornecidos.")


# Criado o PUT (Atualiza) de Necessidades Específicas.
@router.put(
    "/atualizar/{id}",
    status_code=HTTPStatus.OK,
    response_model=NecessidadeSchemaPrivate,
)
async def atualiza_cadastro_necessidade_especifica(
    id: int,  # ID da ocupação a ser atualizada
    necessidade: NecessidadeCreate,  # Dados a serem atualizados
    session: T_Session,
    current_admin: T_CurrentUser,  # Usuário autenticado
):
    # Verifica se o usuário é um administrador
    if not isinstance(current_admin, Administrador):
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Requer privilégios de administrador.")

    db_necessidade = await session.scalar(select(NecessidadeEspecifica).where(NecessidadeEspecifica.id == id))

    if not db_necessidade:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Necessidade específica não encontrada.")

    # Verifica se já existe outra ocupação com o mesmo nome
    necessidade_existente = await session.scalar(
        select(NecessidadeEspecifica).where(NecessidadeEspecifica.nome == necessidade.nome, NecessidadeEspecifica.id != id)
    )

    if necessidade_existente:
        raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Já existe uma necessidade específica com esse nome.")

    try:
        db_necessidade.nome = db_necessidade.nome

        await session.commit()
        await session.refresh(db_necessidade)

        return db_necessidade

    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT, detail="Erro ao atualizar necessidade específica. Verifique os dados fornecidos.")


# Criado o DELETE (Deleta) de Necessidades Específicas.
@router.delete(
    "/deletar/{id}",
    status_code=HTTPStatus.NO_CONTENT,
)
async def deleta_necessidade_especifica(
    id: int,
    session: T_Session,
    current_admin: T_CurrentUser,
):
    # Verifica se o usuário é um administrador
    if not isinstance(current_admin, Administrador):
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Requer privilégios de administrador.")

    db_necessidade = await session.scalar(select(NecessidadeEspecifica).where(NecessidadeEspecifica.id == id))

    if not db_necessidade:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Ocupação não encontrada.")

    await session.delete(db_necessidade)
    await session.commit()
