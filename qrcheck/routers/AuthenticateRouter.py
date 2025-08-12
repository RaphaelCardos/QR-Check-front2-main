from typing import Annotated, Union

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from qrcheck.database import get_session_async
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.ParticipanteModels import Participante
from qrcheck.schemas.TokenSchema import Token
from qrcheck.security import (
    cria_token_acesso,
    get_current_user,
    refresh_token_acesso,
    verifica_senha,
)

router = APIRouter(prefix="/auth", tags=["🔑 Autenticação"])


# Annotated é uma classe usada para adicionar metadados (ou atributos) a tipos de dados.
T_Session = Annotated[AsyncSession, Depends(get_session_async)]
T_OAuth2Form = Annotated[OAuth2PasswordRequestForm, Depends()]


# POST (Login) de Token para autenticação de usuário.
# Essa é a parte do LOGIN: onde o usuário digita suas informações para acessar a plataforma.
# A condição para login é que o usuário digite seu Email ou CPF, seguido da senha.
# Se os dados estiverem corretos e forem válidos, um TOKEN é gerado por tempo limitado.
@router.post("/token", response_model=Token)
async def login_de_acesso_token(
    form_data: T_OAuth2Form,
    session: T_Session,
):
    # 1️⃣ Tenta buscar na tabela de Administradores primeiro
    admin = await session.scalar(select(Administrador).where(Administrador.email == form_data.username))

    # Se encontrar um admin, autentica com a senha dele e RETORNA
    if admin and verifica_senha(form_data.password, admin.senha):
        access_token = cria_token_acesso(
            data={
                "sub": str(admin.id),
                "is_admin": True,  # Define que é admin
            }
        )

        response = JSONResponse(
            content={"message": "Autenticação bem-sucedida!", "access_token": access_token, "token_type": "bearer"}
        )
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="Strict", max_age=1800)
        return response  # 🔹 Retorna aqui para evitar que continue executando!

    # 2️⃣ Se não for admin, tenta autenticar como participante
    participante = await session.scalar(
        select(Participante).where(or_(Participante.email == form_data.username, Participante.cpf == form_data.username))
    )

    # Se `participante` for None ou a senha for inválida, retorna erro
    if not participante or not verifica_senha(form_data.password, participante.senha):
        raise HTTPException(status_code=401, detail="CPF/Email ou senha incorretos.")

    # 3️⃣ Cria token de participante
    access_token = cria_token_acesso(
        data={
            "sub": str(participante.id_public),
            "is_admin": False,  # Participantes não são admins
        }
    )

    response = JSONResponse(
        content={"message": "Autenticação bem-sucedida!", "access_token": access_token, "token_type": "bearer"}
    )
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="Strict", max_age=1800)

    return response


# Criando o endpoint para atualização do token de acesso.
@router.post("/refresh_token", response_model=Token)
async def atualiza_token_accesso(
    session: T_Session,
    user: Union[Participante, Administrador] = Depends(get_current_user),
):
    """
    Atualiza o token de acesso do usuário autenticado.
    Suporta tanto Participantes quanto Administradores.
    """

    # Verifica se o usuário é administrador
    is_admin = await session.scalar(select(Administrador).where(Administrador.email == user.email)) is not None

    if isinstance(user, Administrador):
        sub = str(user.id)
        is_admin = True

    else:
        sub = str(user.id_public)
        is_admin = False

    # Gerando novo token de acesso
    access_token = refresh_token_acesso(
        data={
            "sub": sub,
            "is_admin": is_admin,  # Retorna True se for admin
        }
    )

    # Criando a resposta JSON e adicionando o novo token nos cookies
    response = JSONResponse(
        content={"message": "Token atualizado com sucesso!", "access_token": access_token, "token_type": "bearer"}
    )
    response.set_cookie(
        key="access_token",  # Mantém o mesmo nome do token original
        value=access_token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=1800,  # 30 minutos (1800 segundos)
    )

    return response
