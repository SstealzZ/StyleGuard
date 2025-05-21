from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

"""
User Model Module

This module defines the User model for the database, representing registered users
in the StyleGuard application.
"""

class User(Base):
    """
    User database model representing registered users.
    
    Attributes:
        id (int): Primary key
        email (str): User's email address, must be unique
        username (str): User's chosen username
        hashed_password (str): Bcrypt hashed password
        created_at (datetime): Timestamp of user creation
        updated_at (datetime): Timestamp of last user update
        corrections (List[Correction]): List of user's text corrections
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    corrections = relationship("Correction", back_populates="user") 