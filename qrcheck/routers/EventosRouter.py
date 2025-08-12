import uuid
from datetime import date
from http import HTTPStatus
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from qrcheck.database import get_session_async
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.EventoModels import Evento, assoc_participante_evento
from qrcheck.models.ParticipanteModels import Participante
from qrcheck.schemas.EventoSchema import EventosSchemaPublic
from qrcheck.security import get_current_user

router = APIRouter(prefix="/eventos", tags=["🎉 Eventos"])

# Annotated é uma classe usada para adicionar metadados (ou atributos) a tipos de dados.
T_Session = Annotated[AsyncSession, Depends(get_session_async)]
T_CurrentParticipante = Annotated[Participante, Depends(get_current_user)]
T_CurrentAdmin = Annotated[Administrador, Depends(get_current_user)]


# Listar todos os eventos disponíveis (futuros e em andamento)
@router.get(
    "/",
    status_code=HTTPStatus.OK,
    response_model=List[EventosSchemaPublic],
    tags=["🎉 Eventos [Público]"]
)
async def listar_eventos(session: T_Session):
    """Lista todos os eventos disponíveis (futuros e em andamento)"""
    hoje = date.today()
    result = await session.execute(
        select(Evento)
        .where(
            Evento.inscricoes_abertas == True,
            Evento.data_fim >= hoje  # Eventos que ainda não terminaram
        )
        .order_by(Evento.data_inicio)
    )
    eventos = result.scalars().all()
    return eventos


# Listar eventos que o participante está inscrito (futuros e em andamento)
@router.get(
    "/meus-eventos",
    status_code=HTTPStatus.OK,
    response_model=List[EventosSchemaPublic],
    tags=["🎉 Eventos [Participante]"]
)
async def listar_meus_eventos(session: T_Session, current_participante: T_CurrentParticipante):
    """Lista os eventos em que o participante está inscrito (futuros e em andamento)"""
    hoje = date.today()
    result = await session.execute(
        select(Evento)
        .join(assoc_participante_evento, Evento.id == assoc_participante_evento.c.evento_id)
        .where(
            assoc_participante_evento.c.participante_id == current_participante.id,
            Evento.data_fim >= hoje  # Eventos que ainda não terminaram
        )
        .order_by(Evento.data_inicio)
    )
    eventos = result.scalars().all()
    return eventos


# Listar TODOS os eventos que o participante está inscrito (incluindo passados)
@router.get(
    "/todas-inscricoes",
    status_code=HTTPStatus.OK,
    response_model=List[EventosSchemaPublic],
    tags=["🎉 Eventos [Participante]"]
)
async def listar_todas_inscricoes(session: T_Session, current_participante: T_CurrentParticipante):
    """Lista TODOS os eventos em que o participante está inscrito (incluindo passados)"""
    result = await session.execute(
        select(Evento)
        .join(assoc_participante_evento, Evento.id == assoc_participante_evento.c.evento_id)
        .where(
            assoc_participante_evento.c.participante_id == current_participante.id
        )
        .order_by(Evento.data_inicio.desc())  # Ordena por data mais recente primeiro
    )
    eventos = result.scalars().all()
    return eventos


# Verificar se participante está inscrito em um evento específico
@router.get(
    "/{id_evento}/inscrito",
    status_code=HTTPStatus.OK,
    tags=["🎉 Eventos [Participante]"]
)
async def verificar_inscricao(
    id_evento: uuid.UUID,
    session: T_Session,
    current_participante: T_CurrentParticipante
):
    """Verifica se o participante está inscrito em um evento específico"""
    # Verifica se o evento existe
    evento = await session.scalar(select(Evento).where(Evento.id_public == id_evento))
    if not evento:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Evento não encontrado.",
        )

    # Verifica se o participante está inscrito
    inscricao = await session.scalar(
        select(assoc_participante_evento).where(
            assoc_participante_evento.c.participante_id == current_participante.id,
            assoc_participante_evento.c.evento_id == evento.id,
        )
    )

    return {
        "evento_id": id_evento,
        "nome_evento": evento.nome,
        "inscrito": inscricao is not None
    }


# Obter detalhes de um evento específico
@router.get(
    "/{id_evento}",
    status_code=HTTPStatus.OK,
    response_model=EventosSchemaPublic,
    tags=["🎉 Eventos [Público]"]
)
async def obter_evento(id_evento: uuid.UUID, session: T_Session):
    """Obtém os detalhes de um evento específico"""
    evento = await session.scalar(select(Evento).where(Evento.id_public == id_evento))
    if not evento:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Evento não encontrado.",
        )
    return evento 