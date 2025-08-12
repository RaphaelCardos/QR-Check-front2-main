
# Services: Normalmente representam uma camada de lógica de negócio mais complexa.
# Um service pode orquestrar várias funções, interagir com bancos de dados,
# APIs externas e processar dados de forma estruturada.

import uuid
from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models.ParticipanteModels import NecessidadeEspecifica, Ocupacao, Participante
from qrcheck.schemas.ParticipanteSchema import ParticipanteSchemaPrivate
from qrcheck.security import cria_token_acesso, get_senha_hash
from qrcheck.utils.validators_utils import (
    formatar_com_conectivos,
)


# Processa a ocupação de um participante.
# Se "Outra" for selecionada, exige que o campo de ocupação personalizada seja preenchido.
# Se "Outra" não for selecionada, ignora o campo de ocupação personalizada.
async def processa_ocupacao(participante, session):
    # Busca o ID da ocupação "Outra"
    outra_ocupacao = await session.scalar(
        select(Ocupacao).where(Ocupacao.nome == "Outra", Ocupacao.is_custom == False)  # noqa: E712
    )
    outra_id = outra_ocupacao.id if outra_ocupacao else None

    # Se o ID informado for "Outra", exige ocupacao_outro preenchido
    if participante.ocupacao_id == outra_id:
        if not participante.ocupacao_outro or not participante.ocupacao_outro.strip():
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Campo 'ocupacao_outro' é obrigatório quando a ocupação 'Outra' é selecionada."
            )
    # Se o ID informado NÃO for "Outra", ignora ocupacao_outro
    elif participante.ocupacao_outro:
        participante.ocupacao_outro = ""

    # Determina o ocupacao_id
    ocupacao_id = participante.ocupacao_id

    if participante.ocupacao_outro:
        nome_formatado = formatar_com_conectivos(participante.ocupacao_outro)
        # 1. Procura ocupação padrão com esse nome
        ocupacao_existente = await session.scalar(
            select(Ocupacao).where(
                Ocupacao.nome == nome_formatado,
                Ocupacao.is_custom == False  # noqa: E712
            )
        )
        if ocupacao_existente:
            ocupacao_id = ocupacao_existente.id
        else:
            # 2. Procura ocupação personalizada já existente com esse nome
            ocupacao_custom_existente = await session.scalar(
                select(Ocupacao).where(
                    Ocupacao.nome == nome_formatado,
                    Ocupacao.is_custom == True  # noqa: E712
                )
            )
            if ocupacao_custom_existente:
                ocupacao_id = ocupacao_custom_existente.id
            else:
                # 3. Se não existe, cria nova ocupação personalizada
                nova_ocupacao = Ocupacao(nome=nome_formatado, is_custom=True)
                session.add(nova_ocupacao)
                await session.flush()
                ocupacao_id = nova_ocupacao.id
    else:
        ocupacao = await session.scalar(select(Ocupacao).where(Ocupacao.id == ocupacao_id))
        if ocupacao is None:
            raise HTTPException(
                status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
                detail="O ID da ocupação não existe."
            )
    return ocupacao_id


# Processa as necessidades específicas de um participante.
# Se "Outra(s)" for selecionada, exige que o campo de necessidade personalizada seja preenchido.
# Adiciona IDs das necessidades padrão (exceto "Outra(s)").
async def processa_necessidades_especificas(participante, session):
    necessidades_ids = []

    # Busca o ID da necessidade "Outra"
    outra_necessidade = await session.scalar(
        select(NecessidadeEspecifica).where(
            NecessidadeEspecifica.nome == "Outra(s)",
            NecessidadeEspecifica.is_custom == False  # noqa: E712
        )
    )
    outra_necessidade_id = outra_necessidade.id if outra_necessidade else None

    necessidades_especificas = participante.necessidades_especificas or []
    necessidades_personalizadas = participante.necessidades_personalizadas or []

    # Só exige personalizada se "Outra(s)" foi selecionada
    if outra_necessidade_id in necessidades_especificas:
        if not necessidades_personalizadas or not any(n.strip() for n in necessidades_personalizadas):
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Informe pelo menos uma necessidade personalizada ao selecionar 'Outra(s)'."
            )

    # Adiciona IDs das necessidades padrão (exceto "Outra(s)")
    for necessidade_id in necessidades_especificas:
        if necessidade_id != outra_necessidade_id:
            necessidade = await session.scalar(
                select(NecessidadeEspecifica).where(NecessidadeEspecifica.id == necessidade_id)
            )
            if necessidade is None:
                raise HTTPException(
                    status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    detail="O ID da necessidade não existe."
                )
            necessidades_ids.append(necessidade_id)

    # Para cada necessidade personalizada digitada, salva ou vincula
    for necessidade_outro in necessidades_personalizadas:
        nome_formatado = formatar_com_conectivos(necessidade_outro.strip())
        if not nome_formatado:
            continue
        # Procura necessidade padrão com esse nome
        necessidade_existente = await session.scalar(
            select(NecessidadeEspecifica).where(
                NecessidadeEspecifica.nome == nome_formatado,
                NecessidadeEspecifica.is_custom == False  # noqa: E712
            )
        )
        if necessidade_existente:
            necessidades_ids.append(necessidade_existente.id)
            continue
        # Procura necessidade personalizada já existente
        necessidade_custom_existente = await session.scalar(
            select(NecessidadeEspecifica).where(
                NecessidadeEspecifica.nome == nome_formatado,
                NecessidadeEspecifica.is_custom == True  # noqa: E712
            )
        )
        if necessidade_custom_existente:
            necessidades_ids.append(necessidade_custom_existente.id)
            continue
        # Cria nova necessidade personalizada
        nova_necessidade = NecessidadeEspecifica(nome=nome_formatado, is_custom=True)
        session.add(nova_necessidade)
        await session.flush()
        necessidades_ids.append(nova_necessidade.id)

    return necessidades_ids


async def criar_participante(participante, session, gerar_token=False):
    # Verifica se o e-mail já pertence a um administrador
    if await session.scalar(select(Administrador).where(Administrador.email == participante.email)):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Email já cadastrado.",
        )

    db_participante = await session.scalar(
        select(Participante).where(
            (Participante.cpf == participante.cpf) | (Participante.email == participante.email)  # noqa: E501
        )
    )

    if db_participante:  # Se o participante já existe, verifica se o CPF ou o e-mail são iguais  # noqa: E501
        if db_participante.cpf == participante.cpf:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="CPF já cadastrado.",
            )
        elif db_participante.email == participante.email:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Email já cadastrado.",
            )

    # Verifica necessiddades específicas:
    ocupacao_id = await processa_ocupacao(participante, session)
    necessidades_ids = await processa_necessidades_especificas(participante, session)

    db_participante = Participante(
        id_public=uuid.uuid4(),  # Gera um UUID
        nome=participante.nome,
        sobrenome=participante.sobrenome,
        cpf=participante.cpf,
        email=participante.email,
        senha=get_senha_hash(participante.senha),  # Gera o hash da senha
        data_nasc=participante.data_nasc,
        ocupacao_id=ocupacao_id,
        data_criacao=None,
    )

    if necessidades_ids:
        necessidades_objs = await session.scalars(
            select(NecessidadeEspecifica).where(NecessidadeEspecifica.id.in_(necessidades_ids))
        )
        db_participante.necessidades_especificas = necessidades_objs.all()

    session.add(db_participante)
    await session.flush()  # Garante que novo_participante.id está disponível

    # Recarregue o participante com os relacionamentos carregados
    db_participante = await session.scalar(
        select(Participante)
        .where(Participante.id == db_participante.id)
        .options(selectinload(Participante.necessidades_especificas))
    )

    # Montando o schema de resposta...
    participante_schema = ParticipanteSchemaPrivate(
    id=db_participante.id,
    id_public=db_participante.id_public,
    nome=db_participante.nome,
    sobrenome=db_participante.sobrenome,
    cpf=db_participante.cpf,
    email=db_participante.email,
    data_nasc=db_participante.data_nasc,
    ocupacao_id=db_participante.ocupacao_id,
    necessidades_especificas=[n.id for n in db_participante.necessidades_especificas],
    data_criacao=db_participante.data_criacao,
    )

    if gerar_token:
        access_token = cria_token_acesso(data={"sub": db_participante.email})
        return participante_schema, access_token, db_participante
    else:
        return participante_schema
