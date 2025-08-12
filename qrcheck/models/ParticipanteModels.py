from datetime import date, datetime

from sqlalchemy import (
    VARCHAR,
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Sequence,
    String,
    Table,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Import do Registry para mapeamento
from qrcheck.models.EntityModels import table_registry
from qrcheck.models.EventoModels import assoc_participante_evento

# Tabela de associação entre Participante e NecessidadeEspecifica
assoc_participante_necessidade = Table(
    "assoc_participante_necessidade",
    table_registry.metadata,
    Column("participante_id", Integer, ForeignKey("participantes.id"), primary_key=True),
    Column("necessidade_especifica_id", Integer, ForeignKey("necessidades_especificas.id"), primary_key=True),
)

# Definindo a sequência de maneira explícita
id_public_seq = Sequence("id_public_seq", start=0, increment=1, schema="public")


@table_registry.mapped_as_dataclass
class Participante:
    __tablename__ = "participantes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    id_public: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False, unique=True)
    nome: Mapped[str] = mapped_column(String)
    sobrenome: Mapped[str] = mapped_column(String)
    cpf: Mapped[str] = mapped_column(VARCHAR(11), unique=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    senha: Mapped[str] = mapped_column(VARCHAR)
    data_nasc: Mapped[date] = mapped_column(Date)
    ocupacao_id: Mapped[int] = mapped_column(Integer, ForeignKey("ocupacoes.id"), nullable=False)
    data_criacao: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Corrigido: relacionamento com Ocupacao
    ocupacao = relationship("Ocupacao", back_populates="participantes")  # Relacionamento

    # Relação N:N com NecessidadeEspecifica usando a tabela de associação
    necessidades_especificas: Mapped[list["NecessidadeEspecifica"]] = relationship(secondary="assoc_participante_necessidade", init=False)  # noqa: E501

    # Corrigido: relação 0:N com Evento
    eventos = relationship("Evento", secondary=assoc_participante_evento, back_populates="participantes")


@table_registry.mapped_as_dataclass
class Ocupacao:
    __tablename__ = "ocupacoes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    nome: Mapped[str] = mapped_column(String, nullable=False)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False, nullable=True)

    # Corrigido: relação com Participante
    participantes = relationship("Participante", back_populates="ocupacao")


@table_registry.mapped_as_dataclass
class NecessidadeEspecifica:
    __tablename__ = "necessidades_especificas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    nome: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relação N:N com Participante usando a tabela de associação
    participantes: Mapped[list["Participante"]] = relationship(
        "Participante",
        secondary="assoc_participante_necessidade",
        back_populates="necessidades_especificas",
        default_factory=list,  # Torna a lista de participantes opcional
    )
