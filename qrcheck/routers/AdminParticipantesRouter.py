from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from qrcheck.database import get_session_async
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.ParticipanteModels import Participante
from qrcheck.schemas.ParticipanteSchema import (
    ParticipanteListSchemaPrivate,
    ParticipanteSchemaCreate,
    ParticipanteSchemaPrivate,
    ParticipanteSchemaPublic,
)
from qrcheck.security import (
    get_current_user,
)
from qrcheck.services.participante_service import (
    criar_participante,
)

router = APIRouter(prefix="/admin/participantes", tags=["👶 Participantes [Admin]"])


# Annotated é uma classe usada para adicionar metadados (ou atributos) a tipos de dados.  # noqa: E501
T_Session = Annotated[AsyncSession, Depends(get_session_async)]
T_CurrentParticipante = Annotated[Participante, Depends(get_current_user)]
T_CurrentAdmin = Annotated[Administrador, Depends(get_current_user)]

# - ADMIN - #####################################################


# Criado o GET (Perfil) de participante pro Admin.
# Essa página permite o admin acessar as informações de um participante.
@router.get(
    "/{id_participante}",
    status_code=HTTPStatus.OK,
    response_model=ParticipanteSchemaPublic,
    tags=["👶 Participantes [Admin]"],
)
async def acessa_perfil_participante(id_participante: int, session: T_Session, current_admin= T_CurrentAdmin):

    participante = await session.scalar(
    select(Participante)
    .where(Participante.id == id_participante)
    .options(selectinload(Participante.necessidades_especificas))
)
    if not participante:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Participante não encontrado.",
        )

    return ParticipanteSchemaPrivate(
            id=participante.id,
            id_public=participante.id_public,
            nome=participante.nome,
            sobrenome=participante.sobrenome,
            cpf=participante.cpf,
            email=participante.email,
            data_nasc=participante.data_nasc,
            ocupacao_id=participante.ocupacao_id,
            necessidades_especificas=[n.id for n in participante.necessidades_especificas],
            data_criacao=participante.data_criacao,
        )


# Criado o GET (LISTAR) de todos os participantes.
# Essa página permite o admin acessar as informações de todos os participantes.
@router.get("/listar", status_code=HTTPStatus.OK, response_model=ParticipanteListSchemaPrivate, tags=["👶 Participantes [Admin]"])
async def lista_participantes_admin(current_admin: T_CurrentAdmin, session: T_Session, page: int = 1, size: int = 20):

    lista_participantes = await session.scalars(
        select(Participante)
        .options(selectinload(Participante.necessidades_especificas))
        .order_by(Participante.data_criacao.desc())
    )

    lista_participantes = lista_participantes.all()
    total = len(lista_participantes)
    start = (page - 1) * size
    end = start + size
    participantes_page = lista_participantes[start:end]

    if not participantes_page:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Nenhum participante encontrado.",
        )

    return {
        "total": total,
        "page": page,
        "size": size,
        "participantes": [
            ParticipanteSchemaPrivate(
            id=participante.id,
            id_public=participante.id_public,
            nome=participante.nome,
            sobrenome=participante.sobrenome,
            cpf=participante.cpf,
            email=participante.email,
            data_nasc=participante.data_nasc,
            ocupacao_id=participante.ocupacao_id,
            necessidades_especificas=[n.id for n in participante.necessidades_especificas],
            data_criacao=participante.data_criacao,
        )
            for participante in participantes_page
        ],
    }


@router.post(
    "/cadastro",
    status_code=HTTPStatus.CREATED,
    response_model=ParticipanteSchemaPrivate,
    tags=["👶 Participantes [Admin]"],
)
async def admin_cadastra_participante(participante: ParticipanteSchemaCreate, session: T_Session):
    # async def cadastra_participante_admin(participante: ParticipanteSchemaCreate, session: T_Session, current_admin: T_CurrentAdmin):  # noqa: E501

    participante_schema = await criar_participante(participante, session)
    if not participante_schema:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Erro ao cadastrar participante.",
        )

    await session.commit()

    return participante_schema


@router.delete(
    "/deletar/{id_participante}",
    status_code=HTTPStatus.NO_CONTENT,
    tags=["👶 Participantes [Admin]"],
)
async def admin_deleta_participante(
    id_participante: int,
    session: T_Session,
):
    # Busca participante com a ocupação relacionada
    db_participante = await session.scalar(
    select(Participante)
    .where(Participante.id == id_participante)
    .options(
        selectinload(Participante.ocupacao),
        selectinload(Participante.necessidades_especificas),
    )
)

    # Se o participante não for encontrado, lança uma exceção
    if not db_participante:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Participante não encontrado.",
        )

    # Exclui o participante
    await session.delete(db_participante)
    await session.commit()
