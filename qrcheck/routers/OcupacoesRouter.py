from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from psycopg2 import IntegrityError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from qrcheck.database import get_session_async
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.ParticipanteModels import Ocupacao
from qrcheck.schemas.OcupacaoSchema import OcupacaoCreate, OcupacaoSchemaPrivate, OcupacaoSchemaPublic
from qrcheck.security import get_current_user

router = APIRouter(prefix="/ocupacoes", tags=["💼 Ocupações"])


# Annotated é uma classe usada para adicionar metadados (ou atributos) a tipos de dados.  # noqa: E501
T_Session = Annotated[AsyncSession, Depends(get_session_async)]
T_CurrentUser = Annotated[Administrador, Depends(get_current_user)]


# Ocupações: #####
# Criado o GET (Lista) de Ocupações.
@router.get(
    "/listar",
    status_code=HTTPStatus.OK,
    response_model=list[OcupacaoSchemaPublic],
)
async def lista_ocupacoes(session: T_Session):
    # Filtra ocupações onde is_custom é False
    result = await session.execute(select(Ocupacao).where(Ocupacao.is_custom.is_(False)))  # noqa: E712
    lista_ocupacoes = result.scalars().all()
    return lista_ocupacoes


# Criado o GET (Acessa) de Ocupações.
@router.get("/{id}", status_code=HTTPStatus.OK, response_model=OcupacaoSchemaPublic)
async def acessa_ocupacao(id: int, session: T_Session):
    ocupacao = await session.scalar(select(Ocupacao).where(Ocupacao.id == id))
    if not ocupacao:
        raise HTTPException(status_code=404, detail="Ocupação não encontrada.")
    return ocupacao


# Criado o POST (Cadastra) de Ocupações.
@router.post(
    "/cadastrar",
    status_code=HTTPStatus.CREATED,
    response_model=OcupacaoSchemaPrivate,
)
async def cadastra_ocupacao(ocupacao: OcupacaoCreate, session: T_Session, current_admin: T_CurrentUser):
    # Verifica se o usuário é um administrador
    if not isinstance(current_admin, Administrador):
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Requer privilégios de administrador.")

    # Se for uma lista de ocupações
    if isinstance(ocupacao.nome, list):
        for nome in ocupacao.nome:
            # Verifica se a ocupação já existe
            ocupacao_existente = await session.scalar(select(Ocupacao).where(Ocupacao.nome == nome))
            if ocupacao_existente:
                raise HTTPException(status_code=HTTPStatus.CONFLICT, detail=f"Já existe uma ocupação com o nome '{nome}'.")

            try:
                # Cria a ocupação no banco de dados
                db_ocupacao = Ocupacao(nome=nome)
                session.add(db_ocupacao)
                await session.commit()
                await session.refresh(db_ocupacao)

            except IntegrityError:
                await session.rollback()
                raise HTTPException(
                    status_code=HTTPStatus.CONFLICT, detail=f"Erro ao cadastrar ocupação '{nome}'. Verifique os dados fornecidos."
                )

        return db_ocupacao

    # Se for uma única ocupação
    else:
        ocupacao_existente = await session.scalar(select(Ocupacao).where(Ocupacao.nome == ocupacao.nome))
    if ocupacao_existente:
        raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Já existe uma ocupação com esse nome.")

    try:
        db_ocupacao = Ocupacao(nome=ocupacao.nome)
        session.add(db_ocupacao)
        await session.commit()
        await session.refresh(db_ocupacao)

        return db_ocupacao

    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Erro ao cadastrar ocupação. Verifique os dados fornecidos.")


# Criado o PUT (Atualiza) de Ocupações.
@router.put(
    "/atualizar/{id}",
    status_code=HTTPStatus.OK,
    response_model=OcupacaoSchemaPrivate,
)
async def atualiza_cadastro_ocupacao(
    id: int,  # ID da ocupação a ser atualizada
    ocupacoes: OcupacaoCreate,  # Dados a serem atualizados
    session: T_Session,
    current_admin: T_CurrentUser,  # Usuário autenticado
):
    # Verifica se o usuário é um administrador
    if not isinstance(current_admin, Administrador):
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Requer privilégios de administrador.")

    db_ocupacao = await session.scalar(select(Ocupacao).where(Ocupacao.id == id))

    if not db_ocupacao:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Ocupação não encontrada.")

    # Verifica se já existe outra ocupação com o mesmo nome
    ocupacao_existente = await session.scalar(select(Ocupacao).where(Ocupacao.nome == ocupacoes.nome, Ocupacao.id != id))

    if ocupacao_existente:
        raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Já existe uma ocupação com esse nome.")

    try:
        db_ocupacao.nome = ocupacoes.nome

        await session.commit()
        await session.refresh(db_ocupacao)

        return db_ocupacao

    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Erro ao atualizar ocupação. Verifique os dados fornecidos.")


# Criado o DELETE (Deleta) de Ocupações.
@router.delete(
    "/deletar/{id}",
    status_code=HTTPStatus.NO_CONTENT,
)
async def deleta_ocupacao(
    id: int,
    session: T_Session,
    current_admin: T_CurrentUser,
):
    # Verifica se o usuário é um administrador
    if not isinstance(current_admin, Administrador):
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Requer privilégios de administrador.")

    db_ocupacao = await session.scalar(select(Ocupacao).where(Ocupacao.id == id))

    if not db_ocupacao:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Ocupação não encontrada.")

    await session.delete(db_ocupacao)
    await session.commit()
