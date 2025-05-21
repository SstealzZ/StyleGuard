import asyncio
from database import Base, engine
from models.user import User
from models.correction import Correction

"""
Database Initialization Script (Async Version)

This script creates all database tables based on SQLAlchemy models using async IO.
Run this script to initialize or reset the database schema.
"""

async def init_db_async():
    """
    Creates all database tables asynchronously.
    
    This function will drop all existing tables and create new ones
    based on the current model definitions.
    """
    async with engine.begin() as conn:
        # Drop all tables first
        await conn.run_sync(Base.metadata.drop_all)
        # Then create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database tables created successfully.")

if __name__ == "__main__":
    asyncio.run(init_db_async()) 