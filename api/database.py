from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from config import get_settings

"""
Database Configuration Module

This module sets up the SQLAlchemy engine and session factory for database operations.
It also provides the Base class for declarative models.
"""

settings = get_settings()
engine = create_async_engine(
    settings.database_url.replace("sqlite:///", "sqlite+aiosqlite:///"),
    echo=True,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)
Base = declarative_base()

async def get_session():
    """
    Creates and yields a new async database session.
    
    Yields:
        AsyncSession: An async SQLAlchemy session for database operations
        
    Usage:
        async with get_session() as session:
            await session.execute(query)
    """
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close() 