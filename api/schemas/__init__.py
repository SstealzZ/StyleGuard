"""
Schemas Package

This package contains all Pydantic models for request/response validation
in the StyleGuard application.
"""

from .user import UserBase, UserCreate, UserUpdate, UserInDB, UserResponse
from .correction import CorrectionBase, CorrectionCreate, CorrectionInDB, CorrectionResponse

__all__ = [
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    "UserResponse",
    "CorrectionBase",
    "CorrectionCreate",
    "CorrectionInDB",
    "CorrectionResponse"
] 