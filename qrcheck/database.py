from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import Session

from qrcheck.settings import Settings

# ALTERAÇÃO FEITA: Antes a conexão (Session) com o banco de dados era feita de forma síncrona,
# o que poderia causar problemas de desempenho em aplicações assíncronas.
# Agora, a conexão é feita de forma assíncrona, permitindo melhor desempenho e escalabilidade.

# Criação da engine síncrona para operações de banco de dados (migration do Alembic).
engine_sync = create_engine(Settings().DATABASE_URL_SYNC)


@contextmanager
def get_session_sync():
    with Session(engine_sync) as session:
        yield session


# Criação da engine assíncrona para operações de banco de dados (FastAPI).
# A engine assíncrona permite que o FastAPI trabalhe de forma não bloqueante com o banco de dados.
# LEMBRAR: Tornar echo=False em produção para evitar logs excessivos.
# Criação do AsyncEngine
engine_async = create_async_engine(Settings().DATABASE_URL_ASYNC)


async def get_session_async():
    async with AsyncSession(engine_async, expire_on_commit=False) as session:
        yield session
