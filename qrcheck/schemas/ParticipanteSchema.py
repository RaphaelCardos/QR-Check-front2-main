from datetime import date, datetime
from typing import List, Optional

from pydantic import (
    UUID4,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    ValidationInfo,
    field_validator,
)

from qrcheck.utils.validators_utils import (
    validar_cpf_util,
    validar_data_nasc_util,
    validar_necessidades_personalizadas_util,
    validar_nome_util,
    validar_ocupacao_outro_util,
    validar_senha_util,
)


class ParticipanteSchemaCreate(BaseModel):
    nome: str
    sobrenome: str
    cpf: str = Field(example="13634934000")
    email: EmailStr
    senha: str = Field(example="Miojo*123")
    data_nasc: date = Field(example=date(1990, 1, 1))
    ocupacao_id: int = Field(example=1)
    ocupacao_outro: Optional[str] = Field(default=None, example="")
    necessidades_especificas: Optional[List[int]] = []
    necessidades_personalizadas: List[str] = []

    # Validador de CPF
    @field_validator("cpf", mode="before")
    def validar_cpf(cls, cpf: str) -> str:
        return validar_cpf_util(cpf)

    # Validador de Nome e Sobrenome
    @field_validator("nome", "sobrenome", mode="before")
    def validar_nome(cls, nome: str, info: ValidationInfo) -> str:
        return validar_nome_util(nome, info)

    # Validador de senha
    @field_validator("senha", mode="before")
    def validar_senha(cls, senha: str) -> str:
        return validar_senha_util(senha)

    # Validador de data de nascimento
    @field_validator("data_nasc", mode="before")
    def validar_idade(cls, data_nasc: date) -> date:
        return validar_data_nasc_util(data_nasc)

    # Validador de ocupação personalizada
    @field_validator("ocupacao_outro", mode="before")
    def validar_ocupacao_outro(cls, ocupacao_outro: str) -> str:
        return validar_ocupacao_outro_util(ocupacao_outro)

    # Validador de Necessidades Personalizadas
    @field_validator("necessidades_personalizadas", mode="after")
    def validar_necessidades_personalizadas(cls, necessidades_personalizadas: List[str], info: ValidationInfo) -> List[str]:
        return validar_necessidades_personalizadas_util(necessidades_personalizadas, info)


class ParticipanteSchemaUpdate(BaseModel):
    id_public: UUID4
    nome: str | None
    sobrenome: str | None
    cpf: str | None = Field(example="13634934000")
    email: EmailStr | None
    senha: str | None = Field(example="Miojo*123")
    data_nasc: date | None = Field(example=date(1990, 1, 1))
    ocupacao_id: int | None = Field(example=1)
    ocupacao_outro: str | None = None
    necessidades_especificas: Optional[List[int]] = []
    necessidades_personalizadas: Optional[List[str]] = None

    # Validador de CPF
    @field_validator("cpf", mode="before")
    def validar_cpf(cls, cpf: str) -> str:
        return validar_cpf_util(cpf)

    # Validador de Nome e Sobrenome
    @field_validator("nome", "sobrenome", mode="before")
    def validar_nome(cls, nome: str, info: ValidationInfo) -> str:
        return validar_nome_util(nome, info)

    # Validador de senha
    @field_validator("senha", mode="before")
    def validar_senha(cls, senha: str) -> str:
        return validar_senha_util(senha)

    # Validador de data de nascimento
    @field_validator("data_nasc", mode="before")
    def validar_idade(cls, data_nasc: date) -> date:
        return validar_data_nasc_util(data_nasc)

    # Validador de ocupação personalizada
    @field_validator("ocupacao_outro", mode="before")
    def validar_ocupacao_outro(cls, ocupacao_outro: str) -> str:
        return validar_ocupacao_outro_util(ocupacao_outro)

    # Validador de Necessidades Personalizadas
    @field_validator("necessidades_personalizadas", mode="after")
    def validar_necessidades_personalizadas(cls, necessidades_personalizadas: List[str], info: ValidationInfo) -> List[str]:
        return validar_necessidades_personalizadas_util(necessidades_personalizadas, info)


class ParticipanteSchemaPublic(BaseModel):
    id_public: UUID4
    nome: str
    sobrenome: str
    cpf: str
    email: EmailStr
    data_nasc: date
    ocupacao_id: int
    necessidades_especificas: Optional[List[int]] = []

    # Schemas que recebem objetos de resposta do banco de dados deve term o atributo model_config
    # com o valor ConfigDict(from_attributes=True) para que os atributos sejam lidos corretamente.
    model_config = ConfigDict(from_attributes=True)


class ParticipanteSchemaPrivate(BaseModel):
    id: int
    id_public: UUID4
    nome: str
    sobrenome: str
    cpf: str
    email: EmailStr
    data_nasc: date
    ocupacao_id: int
    necessidades_especificas: Optional[List[int]] = []
    data_criacao: datetime

    model_config = ConfigDict(from_attributes=True)


class ParticipanteListSchemaPrivate(BaseModel):
    total: int
    page: int
    size: int
    participantes: List[ParticipanteSchemaPrivate]

    model_config = ConfigDict(from_attributes=True)
