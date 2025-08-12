from datetime import datetime

from pydantic import (
    UUID4,
    BaseModel,
    ConfigDict,
    EmailStr,
)


class AdministradorSchema(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    model_config = ConfigDict(from_attributes=True)


class AdministradorSchemaPublic(BaseModel):
    id: UUID4 | None = None
    nome: str
    email: EmailStr
    data_criacao: datetime
    model_config = ConfigDict(from_attributes=True)
