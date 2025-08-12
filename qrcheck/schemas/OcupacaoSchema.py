from typing import Annotated

from fastapi import Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from qrcheck.database import get_session_async
from qrcheck.models.ParticipanteModels import Ocupacao

T_Session = Annotated[AsyncSession, Depends(get_session_async)]


class OcupacaoSchemaPublic(BaseModel):
    id: int | None = None
    nome: str

    model_config = ConfigDict(from_attributes=True)


class OcupacaoSchemaPrivate(BaseModel):
    id: int | None = None
    nome: str
    is_custom: bool | None = None

    model_config = ConfigDict(from_attributes=True)


class OcupacaoCreate(BaseModel):
    nome: str
    is_custom: bool | None = None

    @staticmethod
    async def obter_ou_criar_ocupacao(nome: str, session: T_Session) -> Ocupacao:
        # Verifica se a ocupação já existe
        ocupacao_existente = await session.scalar(select(Ocupacao).where(Ocupacao.nome == nome))
        # Se a ocupação já existe, retorna o id da ocupação existente
        if ocupacao_existente:
            return ocupacao_existente

        # Se não existir, cria uma nova ocupação personalizada
        nova_ocupacao = Ocupacao(nome=nome, is_custom=True)
        session.add(nova_ocupacao)
        await session.commit()
        await session.refresh(nova_ocupacao)

        return nova_ocupacao
