from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from database import get_session
from models import User
from schemas.correction import CorrectionCreate, CorrectionResponse
from services.correction import (
    create_correction,
    get_user_corrections,
    get_correction,
    delete_correction
)
from utils.security import get_current_user

"""
Corrections Routes Module

This module defines the routes for text correction operations
in the StyleGuard application.
"""

router = APIRouter(
    prefix="/corrections",
    tags=["corrections"],
    dependencies=[Depends(get_current_user)]  # Protect all routes in this router
)

@router.post("/", response_model=CorrectionResponse)
async def create_text_correction(
    correction: CorrectionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """
    Creates a new text correction.
    
    Args:
        correction (CorrectionCreate): The text to correct
        current_user (User): The authenticated user
        db (AsyncSession): The database session
        
    Returns:
        CorrectionResponse: The correction result
    """
    return await create_correction(db, correction, current_user.id)

@router.get("/", response_model=List[CorrectionResponse])
async def read_user_corrections(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """
    Retrieves a user's correction history.
    
    Args:
        skip (int): Number of records to skip
        limit (int): Maximum number of records to return
        current_user (User): The authenticated user
        db (AsyncSession): The database session
        
    Returns:
        List[CorrectionResponse]: List of corrections
    """
    return await get_user_corrections(db, current_user.id, skip, limit)

@router.get("/{correction_id}", response_model=CorrectionResponse)
async def read_correction(
    correction_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """
    Retrieves a specific correction.
    
    Args:
        correction_id (int): The ID of the correction
        current_user (User): The authenticated user
        db (AsyncSession): The database session
        
    Returns:
        CorrectionResponse: The correction data
        
    Raises:
        HTTPException: If correction is not found
    """
    correction = await get_correction(db, correction_id, current_user.id)
    if not correction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Correction not found"
        )
    return correction

@router.delete("/{correction_id}")
async def remove_correction(
    correction_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_session)
):
    """
    Deletes a specific correction.
    
    Args:
        correction_id (int): The ID of the correction to delete
        current_user (User): The authenticated user
        db (AsyncSession): The database session
        
    Returns:
        dict: Success message
        
    Raises:
        HTTPException: If correction is not found
    """
    success = await delete_correction(db, correction_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Correction not found"
        )
    return {"detail": "Correction deleted successfully"} 