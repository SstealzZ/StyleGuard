"""
Models Package

This package contains all SQLAlchemy models for the StyleGuard application.
"""

from .user import User
from .correction import Correction

__all__ = ["User", "Correction"] 