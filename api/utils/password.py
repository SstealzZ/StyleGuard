from passlib.context import CryptContext

"""
Password Utilities Module

This module provides password-related utilities for hashing and verification
in the StyleGuard application.
"""

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against its hash.
    
    Args:
        plain_password (str): The password to verify
        hashed_password (str): The hashed password to compare against
        
    Returns:
        bool: True if the password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Generates a password hash using bcrypt.
    
    Args:
        password (str): The plain password to hash
        
    Returns:
        str: The hashed password
    """
    return pwd_context.hash(password) 