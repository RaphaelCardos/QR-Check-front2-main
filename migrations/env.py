from logging.config import fileConfig

# from base import table_registry

from sqlalchemy import Engine, MetaData
from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from qrcheck.models.EntityModels import metadata
# from qrcheck.models.ParticipanteModel import Participante, Ocupacao, NecessidadeEspecifica, participante_necessidade
# from qrcheck.models.AdministradorModels import Administrador
from qrcheck.models import(
    AdministradorModels,
    EventoModels,
    ParticipanteModels,
)
from qrcheck.settings import Settings

# # Adicione logs para verificar se o Alembic está reconhecendo as tabelas
# import logging
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)
# logger.debug(f"Tabelas detectadas pelo Alembic: {metadata.tables.keys()}")

# metadata.reflect(bind=engine)

# # Adicionar explicitamente as tabelas dos modelos
# metadata.tables.update(Participante.metadata.tables)
# metadata.tables.update(Administrador.metadata.tables)
# metadata.tables.update(Ocupacao.metadata.tables)
# metadata.tables.update(NecessidadeEspecifica.metadata.tables)
# metadata.tables.update(participante_necessidade.metadata.tables)

config = context.config
config.set_main_option('sqlalchemy.url', Settings().DATABASE_URL_SYNC)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# target_metadata = metadata  # O Alembic agora usará todas as tabelas registradas em EntityModels.py

target_metadata = metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()