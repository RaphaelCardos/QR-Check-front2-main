from datetime import datetime

from sqlalchemy import VARCHAR, DateTime, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

# Import do Registry para mapeamento
from qrcheck.models.EntityModels import table_registry


@table_registry.mapped_as_dataclass
class Administrador:
    __tablename__ = "administradores"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    nome: Mapped[str] = mapped_column(String)
    senha: Mapped[str] = mapped_column(VARCHAR)
    email: Mapped[str] = mapped_column(String, unique=True)
    data_criacao: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())  # noqa: E501
