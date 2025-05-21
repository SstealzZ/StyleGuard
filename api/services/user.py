from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from models import User
from schemas.user import UserCreate, UserUpdate
from utils.password import get_password_hash, verify_password

"""
User Service Module

This module contains the business logic for user-related operations
in the StyleGuard application.
"""

async def authenticate_user(db: AsyncSession, username: str, password: str) -> User:
    """
    Authenticates a user with their username and password.
    
    Args:
        db (AsyncSession): The database session
        username (str): The username or email to authenticate with
        password (str): The password to verify
        
    Returns:
        User: The authenticated user if credentials are valid, None otherwise
    """
    user = await get_user_by_email(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def get_user(db: AsyncSession, user_id: int) -> User:
    """
    Retrieves a user by their ID.
    
    Args:
        db (AsyncSession): The database session
        user_id (int): The ID of the user to retrieve
        
    Returns:
        User: The user object if found, None otherwise
    """
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str) -> User:
    """
    Retrieves a user by their email address.
    
    Args:
        db (AsyncSession): The database session
        email (str): The email address to search for
        
    Returns:
        User: The user object if found, None otherwise
    """
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user: UserCreate) -> User:
    """
    Creates a new user in the database.
    
    Args:
        db (AsyncSession): The database session
        user (UserCreate): The user data for creation
        
    Returns:
        User: The created user object
        
    Raises:
        HTTPException: If a user with the same email already exists
    """
    # Check if user with this email already exists
    existing_user = await get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=get_password_hash(user.password)
    )
    
    try:
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating user"
        ) from e

async def update_user(db: AsyncSession, user_id: int, user_update: UserUpdate) -> User:
    """
    Updates an existing user's information.
    
    Args:
        db (AsyncSession): The database session
        user_id (int): The ID of the user to update
        user_update (UserUpdate): The update data
        
    Returns:
        User: The updated user object
    """
    db_user = await get_user(db, user_id)
    if not db_user:
        return None
        
    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
    for field, value in update_data.items():
        setattr(db_user, field, value)
        
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def delete_user(db: AsyncSession, user_id: int) -> bool:
    """
    Deletes a user from the database.
    
    Args:
        db (AsyncSession): The database session
        user_id (int): The ID of the user to delete
        
    Returns:
        bool: True if user was deleted, False if user was not found
    """
    db_user = await get_user(db, user_id)
    if not db_user:
        return False
        
    await db.delete(db_user)
    await db.commit()
    return True 