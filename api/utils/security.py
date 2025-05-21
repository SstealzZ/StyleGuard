from datetime import datetime, timedelta
from typing import Optional, Tuple
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from config import get_settings
from database import get_session
from models import User

"""
Security Utilities Module

This module provides security-related utilities for JWT token generation
and validation in the StyleGuard application.
"""

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def create_token_pair(data: dict) -> Tuple[str, str]:
    """
    Creates an access token and refresh token pair.
    
    Args:
        data (dict): The data to encode in the tokens
        
    Returns:
        Tuple[str, str]: A tuple containing (access_token, refresh_token)
    """
    access_token_data = data.copy()
    refresh_token_data = data.copy()

    access_token_expires = datetime.utcnow() + timedelta(hours=24)
    refresh_token_expires = datetime.utcnow() + timedelta(days=7)

    access_token_data.update({
        "exp": access_token_expires,
        "token_type": "access"
    })
    refresh_token_data.update({
        "exp": refresh_token_expires,
        "token_type": "refresh"
    })

    access_token = jwt.encode(
        access_token_data,
        settings.secret_key,
        algorithm=settings.algorithm
    )
    refresh_token = jwt.encode(
        refresh_token_data,
        settings.secret_key,
        algorithm=settings.algorithm
    )

    return access_token, refresh_token

def decode_token(token: str) -> dict:
    """
    Decodes and validates a JWT token.
    
    Args:
        token (str): The JWT token to decode
        
    Returns:
        dict: The decoded token payload
        
    Raises:
        HTTPException: If the token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        
        if not payload.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token subject",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        exp = payload.get("exp")
        if not exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has no expiration",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        if datetime.utcfromtimestamp(exp) < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return payload
            
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_session)
) -> User:
    """
    Validates the access token and returns the current user.
    
    Args:
        token (str): The JWT token from the request
        db (AsyncSession): The database session
        
    Returns:
        User: The current authenticated user
        
    Raises:
        HTTPException: If the token is invalid or expired
    """
    payload = decode_token(token)
    
    if payload.get("token_type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    from services.user import get_user  # Import here to avoid circular dependency
    user = await get_user(db, int(payload["sub"]))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_refresh_user(
    token: str,
    db: AsyncSession = Depends(get_session)
) -> User:
    """
    Validates the refresh token and returns the user.
    
    Args:
        token (str): The refresh token
        db (AsyncSession): The database session
        
    Returns:
        User: The user associated with the refresh token
        
    Raises:
        HTTPException: If the token is invalid or expired
    """
    payload = decode_token(token)
    
    if payload.get("token_type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    from services.user import get_user
    user = await get_user(db, int(payload["sub"]))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user 