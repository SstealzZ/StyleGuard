from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session
from models import User
from schemas.user import UserCreate, UserResponse
from services.user import authenticate_user, create_user, get_user
from utils.security import create_token_pair, get_current_user, get_refresh_user
from config import get_settings

"""
Authentication Routes Module

This module handles all authentication-related routes in the StyleGuard application.
"""

router = APIRouter(prefix="/auth", tags=["auth"])

settings = get_settings()

@router.options("/register", status_code=200)
async def options_register(request: Request, response: Response):
    """
    Gère les requêtes OPTIONS pour le endpoint register
    
    Args:
        request: La requête
        response: La réponse
        
    Returns:
        dict: Une réponse vide
    """
    response.headers["Access-Control-Allow-Origin"] = "http://192.168.1.73:9081"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return {}

@router.post("/register", response_model=UserResponse)
async def register(
    request: Request,
    response: Response,
    user_data: UserCreate,
    db: AsyncSession = Depends(get_session)
) -> User:
    """
    Registers a new user.
    
    Args:
        user_data (UserCreate): The user registration data
        db (AsyncSession): The database session
        
    Returns:
        User: The created user
        
    Raises:
        HTTPException: If registration fails
    """
    response.headers["Access-Control-Allow-Origin"] = "http://192.168.1.73:9081"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return await create_user(db, user_data)

@router.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_session)
) -> dict:
    """
    Authenticates a user and returns access and refresh tokens.
    
    Args:
        form_data (OAuth2PasswordRequestForm): The login credentials
        db (AsyncSession): The database session
        
    Returns:
        dict: The token response containing access and refresh tokens
        
    Raises:
        HTTPException: If authentication fails
    """
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token, refresh_token = create_token_pair({"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
async def refresh_token(
    token: str,
    db: AsyncSession = Depends(get_session)
) -> dict:
    """
    Refreshes an expired access token using a valid refresh token.
    
    Args:
        token (str): The refresh token
        db (AsyncSession): The database session
        
    Returns:
        dict: The new token response
        
    Raises:
        HTTPException: If token refresh fails
    """
    user = await get_refresh_user(token, db)
    access_token, refresh_token = create_token_pair({"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Returns the current authenticated user's information.
    
    Args:
        current_user (User): The current authenticated user
        
    Returns:
        User: The user information
    """
    return current_user 