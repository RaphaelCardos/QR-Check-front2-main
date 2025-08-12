from datetime import datetime, timedelta
from http import HTTPStatus
from typing import Annotated, Union
from zoneinfo import ZoneInfo

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt import DecodeError, ExpiredSignatureError, decode, encode
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from qrcheck.database import get_session_async
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.ParticipanteModels import Participante
from qrcheck.schemas.TokenSchema import TokenData
from qrcheck.settings import Settings

pwd_context = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
settings = Settings()

T_Session = Annotated[AsyncSession, Depends(get_session_async)]


def cria_token(data: dict, exp_minutos: int = None, exp_dias: int = None):
    to_encode = data.copy()

    # Define o tempo de expiração
    if exp_minutos:
        expire = datetime.now(tz=ZoneInfo("UTC")) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    elif exp_dias:
        expire = datetime.now(tz=ZoneInfo("UTC")) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    else:
        raise ValueError("É necessário definir um tempo de expiração. [Erro interno da aplicação].")

    to_encode.update({"exp": expire})
    encoded_jwt = encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encoded_jwt


def cria_token_acesso(data: dict):
    return cria_token(data, exp_minutos=settings.ACCESS_TOKEN_EXPIRE_MINUTES)


def refresh_token_acesso(data: dict):
    return cria_token(data, exp_dias=settings.REFRESH_TOKEN_EXPIRE_DAYS)


def get_senha_hash(senha: str):
    return pwd_context.hash(senha)


def verifica_senha(plain_senha: str, hashed_senha: str):
    return pwd_context.verify(plain_senha, hashed_senha)


async def get_current_user(
    session: T_Session, token: str = Depends(oauth2_scheme)
) -> Union[Participante, Administrador]:
    credentials_exception = HTTPException(
        status_code=HTTPStatus.UNAUTHORIZED,
        detail="Não foi possível autenticar as credenciais.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Método de validação do token
    # Verifica se o token é válido e não expirou
    try:
        payload = decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        is_admin: bool = payload.get("is_admin", False)
        exp: int = payload.get("exp")

        if not user_id:
            raise credentials_exception

        token_data = TokenData(user_id=user_id, is_admin=is_admin, exp=exp)

        # Primeiro tenta buscar como Participante
        user = await session.scalar(select(Participante).where(Participante.id_public == token_data.user_id))

        # Se não encontrar como Participante, tenta como Administrador
        if not user:
            user = await session.scalar(select(Administrador).where(Administrador.id == token_data.user_id))

            # Se o usuário for encontrado e for admin, retorna como admin
            if user and token_data.is_admin:
                return user
            else:
                raise credentials_exception

    except (DecodeError, ExpiredSignatureError):
        raise credentials_exception

    return user
