import uuid
from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from qrcheck.database import get_session_async

# from qrcheck.log_app import get_logger_participante
from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.EventoModels import (
    Evento,
    assoc_participante_evento,
)
from qrcheck.models.ParticipanteModels import (
    NecessidadeEspecifica,
    Participante,
)
from qrcheck.schemas.ParticipanteSchema import (
    ParticipanteSchemaCreate,
    ParticipanteSchemaPrivate,
    # ParticipanteSchemaPrivate,
    ParticipanteSchemaPublic,
    ParticipanteSchemaUpdate,
)
from qrcheck.security import (
    get_current_user,
)
from qrcheck.services.participante_service import criar_participante

router = APIRouter(prefix="")


# Annotated é uma classe usada para adicionar metadados (ou atributos) a tipos de dados.  # noqa: E501
T_Session = Annotated[AsyncSession, Depends(get_session_async)]
T_CurrentParticipante = Annotated[Participante, Depends(get_current_user)]
T_CurrentAdmin = Annotated[Administrador, Depends(get_current_user)]


# Participantes: #####


# Criado o GET (Perfil) de participante (Página do QR).
# Essa página não autentica o usuário, apenas acessa as informações
# do usuário autenticado anteriormente.
@router.get(
    "/meu-perfil", status_code=HTTPStatus.OK, response_model=ParticipanteSchemaPublic, tags=["👶 Participantes [Usuário]"]
)
async def acessa_perfil(session: T_Session, request: Request, response: Response, current_participante: T_CurrentParticipante):
    # get_logger_participante(
    #     participante_id=current_participante.id, request=request, response=response, mensagem="Acesso ao perfil"
    # )
    participante = await session.scalar(
    select(Participante)
    .where(Participante.id_public == current_participante.id_public)
    .options(selectinload(Participante.necessidades_especificas))
)
    if not participante:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Cadastro não encontrado. Tente novamente.",
        )

    return ParticipanteSchemaPublic(
            id_public=participante.id_public,
            nome=participante.nome,
            sobrenome=participante.sobrenome,
            cpf=participante.cpf,
            email=participante.email,
            data_nasc=participante.data_nasc,
            ocupacao_id=participante.ocupacao_id,
            necessidades_especificas=[n.id for n in participante.necessidades_especificas],
        )


# Criado o POST (Cadastro) de participantes (Rota principal de cadastro) - É necessário o id_evento.
@router.post(
    "/cadastre-se/{id_evento}",
    status_code=HTTPStatus.CREATED,
    response_model=ParticipanteSchemaPrivate,
    tags=["👶 Participantes [Usuário]"],
)
async def cadastra_participante(session: T_Session, participante: ParticipanteSchemaCreate, id_evento: uuid.UUID, response: Response):  # noqa: E501, PLR0912

    # Recebe id_evento como UUID (id_public)
    evento = await session.scalar(select(Evento).where(Evento.id_public == id_evento))
    if not evento:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Evento não encontrado.",
        )

    participante_schema, access_token, _ = await criar_participante(participante, session, gerar_token=True)
    await session.commit()

    # Criando a resposta com um JSON e depois adicionando o cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,  # Apenas via HTTPS
        samesite="Strict",  # Protege contra CSRF
        max_age=1800,  # Expira em 30min
    )

    return participante_schema


# Associando o participante ao evento (Se inscrevendo no evento).
# Deve ser chamado após o cadastro do participante.
@router.post(
    "/inscricao-evento/{id_evento}",
    status_code=HTTPStatus.OK,
    tags=["👶 Participantes [Usuário]"]
    )
async def associar_participante_evento(
    id_evento: uuid.UUID,
    session: T_Session,
    current_participante: T_CurrentParticipante,  # Usuário autenticado
):
    # Verifica se o evento existe
    evento = await session.scalar(select(Evento).where(Evento.id_public == id_evento))
    if not evento:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Evento não encontrado.",
        )

    # Verifica se o participante já está associado ao evento
    participante_evento = await session.scalar(
        select(assoc_participante_evento).where(
            assoc_participante_evento.c.participante_id == current_participante.id,
            assoc_participante_evento.c.evento_id == evento.id,
        )
    )

    if participante_evento:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail="Participante já está associado a este evento.",
        )

    # Associa o participante ao evento
    db_inscricao = assoc_participante_evento.insert().values(participante_id=current_participante.id, evento_id=evento.id)
    await session.execute(db_inscricao)
    await session.commit()

    return {"detail": "Participante associado ao evento com sucesso."}


# Criado o PUT (ATUALIZAR) de participante.
@router.put(
    "/atualizar-cadastro", status_code=HTTPStatus.OK, response_model=ParticipanteSchemaPublic, tags=["👶 Participantes [Usuário]"]
)
async def atualiza_cadastro_participante(
    participante: ParticipanteSchemaUpdate,  # Dados a serem atualizados
    session: T_Session,
    current_participante: T_CurrentParticipante,  # Usuário autenticado
):
    db_participante = await session.scalar(select(Participante).where(Participante.id_public == current_participante.id_public))  # noqa: E501

    # if not db_participante:
    #     raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Participante não encontrado.")

    if current_participante.id_public != db_participante.id_public:
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Você não tem permissão para alterar este cadastro.")  # noqa: E501

    try:
        db_participante.nome = participante.nome
        db_participante.sobrenome = participante.sobrenome
        db_participante.cpf = participante.cpf
        db_participante.email = participante.email
        db_participante.data_nasc = participante.data_nasc
        db_participante.ocupacao_id = participante.ocupacao_id

        # Atualizar as necessidades específicas associadas ao participante
        if participante.necessidades_especificas is not None:
            novas_necessidades = await session.scalars(
                select(NecessidadeEspecifica).where(NecessidadeEspecifica.id.in_(participante.necessidades_especificas))
            ).all()
            # Atualiza a relação
            db_participante.necessidades_especificas = novas_necessidades

        await session.commit()
        await session.refresh(db_participante)

        return db_participante

    except IntegrityError as e:
        await session.rollback()  # Reverte a transação para evitar inconsistências

        # Converte para minúsculas para facilitar a busca
        error_msg = str(e.orig).lower()

        if "cpf" in error_msg:
            raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Este CPF já está cadastrado.")
        elif "email" in error_msg:
            raise HTTPException(status_code=HTTPStatus.CONFLICT, detail="Este e-mail já está cadastrado.")


# Criado o DELETE (Excluir) de participante.
@router.delete("/deletar-cadastro", status_code=HTTPStatus.NO_CONTENT, tags=["👶 Participantes [Usuário]"])
async def deleta_cadastro_participante(session: T_Session, current_participante: T_CurrentParticipante):
    db_participante = await session.scalar(select(Participante).where(Participante.id_public == current_participante.id_public))  # noqa: E501

    if not db_participante:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Registro não encontrado.",
        )

    # Verifica se o usuário autenticado é o dono do cadastro ##ou um administrador# (FUTURAMENTE)#  # noqa: E501
    # if current_user.id_public != id_public and not current_user.admin:
    if db_participante.id_public != current_participante.id_public:
        raise HTTPException(status_code=HTTPStatus.FORBIDDEN, detail="Você não tem permissão para excluir este cadastro.")  # noqa: E501

    await session.delete(db_participante)
    await session.commit()
