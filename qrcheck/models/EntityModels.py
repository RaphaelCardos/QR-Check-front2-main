# Arquivo para referenciar todos os models do projeto. Assim,
# é possível importar todos os models de uma só vez ao Alembic.

from sqlalchemy.orm import registry

table_registry = registry()
metadata = table_registry.metadata  # Define o metadata para Alembic
