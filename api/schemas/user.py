from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

"""
User Schema Module

This module defines Pydantic models for user-related data validation
and serialization in the StyleGuard application.
"""

class UserBase(BaseModel):
    """
    Base user schema with common attributes.
    
    Attributes:
        email (EmailStr): User's email address
        username (str): User's chosen username
    """
    email: EmailStr
    username: str

class UserCreate(UserBase):
    """
    Schema for user creation, extends UserBase.
    
    Attributes:
        password (str): User's plain text password
    """
    password: str

class UserUpdate(BaseModel):
    """
    Schema for user updates, all fields optional.
    
    Attributes:
        email (Optional[EmailStr]): Updated email address
        username (Optional[str]): Updated username
        password (Optional[str]): New password
    """
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None

class UserInDB(UserBase):
    """
    Schema for user data as stored in database.
    
    Attributes:
        id (int): User ID
        created_at (datetime): Account creation timestamp
        updated_at (Optional[datetime]): Last update timestamp
    """
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    """
    Schema for user data in API responses.
    
    Attributes:
        id (int): User ID
    """
    id: int

    class Config:
        from_attributes = True 