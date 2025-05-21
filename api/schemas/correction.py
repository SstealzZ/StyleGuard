from pydantic import BaseModel
from datetime import datetime

"""
Correction Schema Module

This module defines Pydantic models for correction-related data validation
and serialization in the StyleGuard application.
"""

class CorrectionBase(BaseModel):
    """
    Base correction schema with common attributes.
    
    Attributes:
        original_text (str): The text submitted for correction
    """
    original_text: str

class CorrectionCreate(CorrectionBase):
    """
    Schema for correction creation, extends CorrectionBase.
    No additional fields needed as user_id is extracted from token.
    """
    pass

class CorrectionInDB(CorrectionBase):
    """
    Schema for correction data as stored in database.
    
    Attributes:
        id (int): Correction ID
        user_id (int): ID of the user who requested the correction
        corrected_text (str): The corrected version of the text
        created_at (datetime): Timestamp of correction creation
    """
    id: int
    user_id: int
    corrected_text: str
    created_at: datetime

    class Config:
        from_attributes = True

class CorrectionResponse(CorrectionInDB):
    """
    Schema for correction data in API responses.
    Inherits all fields from CorrectionInDB.
    """
    pass 