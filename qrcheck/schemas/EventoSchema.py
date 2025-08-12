from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EventosSchemaPublic(BaseModel):
    id_public: UUID
    nome: str
    categoria: str
    subcategoria: str
    descricao: str
    data_inicio: date
    data_fim: date
    inscricoes_abertas: bool

    model_config = ConfigDict(from_attributes=True)
