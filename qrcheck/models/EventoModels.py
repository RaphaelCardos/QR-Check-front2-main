from datetime import date

from sqlalchemy import (
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

# Tabela de associação entre Participante e Evento
assoc_participante_evento = Table(
    "assoc_participante_evento",
    table_registry.metadata,
    Column("participante_id", Integer, ForeignKey("participantes.id", ondelete="CASCADE"), primary_key=True),
    Column("evento_id", Integer, ForeignKey("eventos.id", ondelete="CASCADE"), primary_key=True),
    Column("data_inscricao", DateTime, server_default=func.now(), nullable=False),
)

# Definindo a sequência de maneira explícita
id_public_seq = Sequence("id_public_seq", start=0, increment=1, schema="public")


@table_registry.mapped_as_dataclass
class Evento:
    __tablename__ = "eventos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    id_public: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False, unique=True)
    nome: Mapped[str] = mapped_column(String)
    categoria: Mapped[str] = mapped_column(String)
    subcategoria: Mapped[str] = mapped_column(String, nullable=False)
    descricao: Mapped[str] = mapped_column(String, nullable=False)
    data_inicio: Mapped[date] = mapped_column(Date, nullable=False)
    data_fim: Mapped[date] = mapped_column(Date, nullable=False)

    # Relação 1:1 com Endereco.
    endereco: Mapped["Endereco"] = relationship("Endereco", back_populates="evento", uselist=False)

    # Relação 1:N com Evento
    espacos: Mapped[list["Espaco"]] = relationship("Espaco", back_populates="evento")

    # Relação 0:N com Participante
    participantes = relationship("Participante", secondary="assoc_participante_evento", back_populates="eventos")

    inscricoes_abertas: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


@table_registry.mapped_as_dataclass
class Endereco:
    __tablename__ = "enderecos"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    nome: Mapped[str] = mapped_column(String, nullable=False)
    cep: Mapped[int] = mapped_column(Integer, nullable=False)
    rua: Mapped[str] = mapped_column(String, nullable=False)
    numero: Mapped[int] = mapped_column(Integer, nullable=False)
    complemento: Mapped[str] = mapped_column(String)
    bairro: Mapped[str] = mapped_column(String, nullable=False)
    cidade: Mapped[str] = mapped_column(String, nullable=False)
    estado: Mapped[str] = mapped_column(String, nullable=False)

    # Relação 1:1 com Evento. O Unique garante que um endereço só pode estar associado a um evento
    evento_id = mapped_column(ForeignKey("eventos.id_public"), nullable=False, unique=True)
    evento: Mapped["Evento"] = relationship("Evento", back_populates="endereco", uselist=False)


@table_registry.mapped_as_dataclass
class Espaco:
    __tablename__ = "espacos"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    nome: Mapped[str] = mapped_column(String, nullable=False)
    descricao: Mapped[str] = mapped_column(String, nullable=False)
    capacidade: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relação 0:N com Recurso
    recursos = relationship("Recurso", back_populates="espaco")

    # Relação 1:N com Evento
    evento_id: Mapped[int] = mapped_column(ForeignKey("eventos.id_public"), nullable=False)
    evento: Mapped["Evento"] = relationship("Evento", back_populates="espacos")


@table_registry.mapped_as_dataclass
class Recurso:
    __tablename__ = "recursos"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    nome: Mapped[str] = mapped_column(String, nullable=False)
    quantidade: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relação 0:N com Espaco
    espaco_id: Mapped[int] = mapped_column(ForeignKey("espacos.id"), nullable=False)
    espaco = relationship("Espaco", back_populates="recursos")
