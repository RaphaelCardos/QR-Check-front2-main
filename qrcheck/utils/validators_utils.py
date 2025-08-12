
#  Utils (utilities): São funções genéricas e reutilizáveis que não dependem
#  de um contexto específico do projeto. Por exemplo, funções de formatação de datas,
#  manipulação de strings e conversões de tipo podem ser encontradas em módulos utils.

import re
from datetime import date, datetime
from http import HTTPStatus

from fastapi import HTTPException
from pydantic import ValidationInfo


# Função para formatar conectivos em minúsculo
def formatar_com_conectivos(texto: str) -> str:
    conectivos = {"de", "da", "do", "das", "dos", "e"}
    palavras = texto.lower().split()

    return ' '.join(
    palavra if palavra in conectivos and i != 0 else palavra.capitalize()
    for i, palavra in enumerate(palavras)
    )


# Função para validar CPF
def validar_cpf_util(cpf: str) -> str:
    cpf = "".join(filter(str.isdigit, cpf))  # Remove caracteres não numéricos

    if len(cpf) != 11 or not cpf.isdigit():  # noqa: PLR2004
        raise HTTPException(
            status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
            detail="O CPF deve conter exatamente 11 caracteres numéricos."
        )
    # Impede CPFs inválidos como "11111111111"
    if cpf == cpf[0] * 11:
        raise HTTPException(status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            detail="O CPF informado é inválido.")

    # Cálculo do primeiro dígito verificador
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digito1 = (soma * 10) % 11
    digito1 = 0 if digito1 == 10 else digito1  # noqa: PLR2004

    # Cálculo do segundo dígito verificador
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digito2 = (soma * 10) % 11
    digito2 = 0 if digito2 == 10 else digito2  # noqa: PLR2004

    if not (digito1 == int(cpf[9]) and digito2 == int(cpf[10])):
        raise HTTPException(status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            detail="O CPF informado é inválido.")
    return cpf


# Função para validar Nome e Sobrenome
def validar_nome_util(valor: str, info: ValidationInfo) -> str:
    campo = info.field_name  # 'nome' ou 'sobrenome'
    valor = valor.strip()

    min_comprimento = 2

    if not valor:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"{campo.capitalize()} não pode estar vazio."
        )

    if len(valor) < min_comprimento:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail=f"{campo.capitalize()} deve ter pelo menos 2 caracteres."
        )

    # Expressão regular para permitir letras, acentos, cedilha e espaços
    if not re.match(r"^[A-Za-zÀ-ÿ ]+$", valor):
        raise HTTPException(
            status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
            detail=f"O {campo} deve conter apenas letras e espaços."
        )

    return formatar_com_conectivos(valor)


# Função para validar Senha
def validar_senha_util(senha: str) -> str:
    min_comprimento = 8
    if len(senha) < min_comprimento:  # noqa: PLR2004
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="A senha deve ter no mínimo 8 caracteres."
        )
    if not re.search(r"\d", senha):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="A senha deve conter pelo menos um número."
        )
    if not re.search(r"[A-Z]", senha):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="A senha deve conter pelo menos uma letra maiúscula."
        )
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", senha):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="A senha deve conter pelo menos um caractere especial."
        )
    return senha


# Função para validar Data de Nascimento
def validar_data_nasc_util(data_nasc: date) -> date:
    if data_nasc is None:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Informar a data de nascimento é obrigatório para o cadastro."
        )
    if isinstance(data_nasc, str):
        data_nasc = datetime.strptime(data_nasc, "%Y-%m-%d").date()
    hoje = date.today()
    idade = hoje.year - data_nasc.year - ((hoje.month, hoje.day) < (data_nasc.month, data_nasc.day))
    min_idade = 12
    if idade < min_idade:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Participantes com menos de 12 anos não podem se cadastrar."
        )
    return data_nasc


# Função para validar Ocupação
def validar_ocupacao_outro_util(ocupacao_outro: str) -> str:
    if not ocupacao_outro or not ocupacao_outro.strip():
        return ""  # Não valida se não foi informado

    if not re.match(r"^[A-Za-zÀ-ÿ ]+$", ocupacao_outro):
        raise HTTPException(
                status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
                detail="O campo 'ocupacao_outro' deve conter apenas letras e espaços."
            )

    ocupacao_outro = formatar_com_conectivos(ocupacao_outro)

    min_comprimento = 3
    max_comprimento = 80
    # Verifica o comprimento do texto
    if len(ocupacao_outro) < min_comprimento or len(ocupacao_outro) > max_comprimento:
        raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail=f"O campo 'ocupacao_outro' deve ter entre {min_comprimento} e {max_comprimento} caracteres"
        )

    return ocupacao_outro


# Função para validar Necessidades Personalizadas
def validar_necessidades_personalizadas_util(necessidades_personalizadas: list[str], info: ValidationInfo) -> list[str]:
    if necessidades_personalizadas:
        for nome in necessidades_personalizadas:
            nome_strip = nome.strip()
            if not nome_strip:
                raise HTTPException(
                    status_code=HTTPStatus.BAD_REQUEST,
                    detail="Nenhum dos nomes das necessidades personalizadas pode estar vazio."
                )

            if not re.match(r"^[A-Za-zÀ-ÿ ]+$", nome_strip):
                raise HTTPException(
                    status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    detail="Cada necessidade personalizada deve conter apenas letras e espaços."
                )

            min_comprimento = 3
            max_comprimento = 80
            if not (min_comprimento <= len(nome_strip) <= max_comprimento):
                raise HTTPException(
                    status_code=HTTPStatus.BAD_REQUEST,
                    detail="Cada necessidade personalizada deve ter entre 3 e 80 caracteres."
                )

    return [formatar_com_conectivos(nome.strip()) for nome in necessidades_personalizadas]
