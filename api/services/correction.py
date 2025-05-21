from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import Correction
from schemas.correction import CorrectionCreate
from utils.ollama import correct_text
from fastapi import HTTPException

"""
Correction Service Module

This module contains the business logic for text correction operations
in the StyleGuard application.
"""

async def create_correction(
    db: AsyncSession,
    correction: CorrectionCreate,
    user_id: int
) -> Correction:
    """
    Creates a new correction entry and processes the text through Ollama.
    
    Args:
        db (AsyncSession): The database session
        correction (CorrectionCreate): The correction data
        user_id (int): The ID of the user requesting the correction
        
    Returns:
        Correction: The created correction object with the corrected text
        
    Raises:
        HTTPException: If there is an error with Ollama service
    """
    try:
        corrected_text = await correct_text(correction.original_text)
        
        db_correction = Correction(
            user_id=user_id,
            original_text=correction.original_text,
            corrected_text=corrected_text
        )
        
        db.add(db_correction)
        await db.commit()
        await db.refresh(db_correction)
        return db_correction
    except HTTPException as e:
        # Propage l'exception HTTP avec le code et le détail original
        raise e

async def get_user_corrections(
    db: AsyncSession,
    user_id: int,
    skip: int = 0,
    limit: int = 10
) -> list[Correction]:
    """
    Retrieves a user's correction history.
    
    Args:
        db (AsyncSession): The database session
        user_id (int): The ID of the user
        skip (int): Number of records to skip for pagination
        limit (int): Maximum number of records to return
        
    Returns:
        list[Correction]: List of correction objects
    """
    result = await db.execute(
        select(Correction)
        .filter(Correction.user_id == user_id)
        .order_by(Correction.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def get_correction(
    db: AsyncSession,
    correction_id: int,
    user_id: int
) -> Correction:
    """
    Retrieves a specific correction by ID for a user.
    
    Args:
        db (AsyncSession): The database session
        correction_id (int): The ID of the correction to retrieve
        user_id (int): The ID of the user who owns the correction
        
    Returns:
        Correction: The correction object if found, None otherwise
    """
    result = await db.execute(
        select(Correction)
        .filter(Correction.id == correction_id)
        .filter(Correction.user_id == user_id)
    )
    return result.scalar_one_or_none()

async def delete_correction(
    db: AsyncSession,
    correction_id: int,
    user_id: int
) -> bool:
    """
    Deletes a specific correction.
    
    Args:
        db (AsyncSession): The database session
        correction_id (int): The ID of the correction to delete
        user_id (int): The ID of the user who owns the correction
        
    Returns:
        bool: True if correction was deleted, False if not found
    """
    db_correction = await get_correction(db, correction_id, user_id)
    if not db_correction:
        return False
        
    await db.delete(db_correction)
    await db.commit()
    return True 