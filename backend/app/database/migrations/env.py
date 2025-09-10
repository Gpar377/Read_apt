from logging.config import fileConfig
from sqlalchemy import create_engine, pool
from alembic import context
import os
import sys

# Ensure app modules are importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from app.database.models import Base
from app.database.database import DATABASE_URL

# Alembic Config
config = context.config
fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
        future=True,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
