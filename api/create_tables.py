from database import Base, engine
from models.user import User
from models.correction import Correction

"""
Database Initialization Script

This script creates all database tables based on SQLAlchemy models.
Run this script to initialize or reset the database schema.
"""

def init_db():
    """
    Creates all database tables.
    
    This function will drop all existing tables and create new ones
    based on the current model definitions.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database tables created successfully.") 