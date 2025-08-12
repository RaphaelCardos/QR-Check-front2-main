import asyncio
from typing import AsyncGenerator, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from qrcheck.app import app
from qrcheck.database import get_session_async
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.EntityModels import table_registry
from qrcheck.security import cria_token_acesso

# Configuração do banco de dados de teste
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Cria um event loop para os testes assíncronos."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def setup_database():
    """Configura o banco de dados de teste."""
    async with engine.begin() as conn:
        await conn.run_sync(table_registry.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(table_registry.metadata.drop_all)


@pytest.fixture
async def session(setup_database) -> AsyncGenerator[AsyncSession, None]:
    """Cria uma sessão de banco de dados para cada teste."""
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()


@pytest.fixture
def client(session: AsyncSession) -> Generator:
    """Cria um cliente FastAPI para os testes."""

    def override_get_session():
        return session

    app.dependency_overrides[get_session_async] = override_get_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
async def admin_token(session: AsyncSession) -> str:
    """Cria um token de administrador para autenticação nos testes."""
    # Criar um administrador de teste
    admin = Administrador(
        nome="Admin Teste",
        email="admin@teste.com",
        senha="senha123",  # A senha será hashed pelo modelo
    )
    session.add(admin)
    await session.commit()
    await session.refresh(admin)

    # Criar token de acesso
    access_token = cria_token_acesso(data={"sub": admin.email})
    return access_token


@pytest.fixture
async def admin_user(session: AsyncSession) -> Administrador:
    """Cria e retorna um usuário administrador para os testes."""
    admin = Administrador(nome="Admin Teste", email="admin@teste.com", senha="senha123")
    session.add(admin)
    await session.commit()
    await session.refresh(admin)
    return admin
