from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

"""
Correction Model Module

This module defines the Correction model for storing text correction history
in the StyleGuard application.
"""

class Correction(Base):
    """
    Correction database model for storing text correction history.
    
    Attributes:
        id (int): Primary key
        user_id (int): Foreign key to the users table
        original_text (str): The text submitted for correction
        corrected_text (str): The corrected version of the text
        created_at (datetime): Timestamp of correction creation
        user (User): Relationship to the User model
    """
    __tablename__ = "corrections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    original_text = Column(Text)
    corrected_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="corrections") 