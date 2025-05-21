"""
Services Package

This package contains the business logic services for the StyleGuard application.
Each service module encapsulates related functionality and database operations.
"""

from .user import (
    get_user,
    get_user_by_email,
    create_user,
    update_user,
    delete_user
)
from .correction import (
    create_correction,
    get_user_corrections,
    get_correction,
    delete_correction
)

__all__ = [
    "get_user",
    "get_user_by_email",
    "create_user",
    "update_user",
    "delete_user",
    "create_correction",
    "get_user_corrections",
    "get_correction",
    "delete_correction"
] 