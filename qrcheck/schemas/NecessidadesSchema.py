from typing import List, Union

from pydantic import BaseModel, ConfigDict


class NecessidadeSchemaPublic(BaseModel):
    id: int | None = None
    nome: str

    model_config = ConfigDict(from_attributes=True)


class NecessidadeSchemaPrivate(BaseModel):
    id: int | None = None
    nome: str
    is_custom: bool | None = None

    model_config = ConfigDict(from_attributes=True)


class NecessidadeCreate(BaseModel):
    nome: Union[str, List[str]]
    # personalizada: bool | None = None
