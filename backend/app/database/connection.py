import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

POSTGRES_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/readapt")
SQLITE_URL = "sqlite:///./dev.db"

DATABASE_URL = POSTGRES_URL if os.getenv("ENV") == "production" else SQLITE_URL

POOL_SIZE = 10 if os.getenv("ENV") == "production" else 5

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},  # Required for SQLite threading
        echo=False,
        future=True,
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=POOL_SIZE,
        max_overflow=20,
        pool_timeout=30,
        pool_recycle=1800,
        echo=False,
        future=True,
    )

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
