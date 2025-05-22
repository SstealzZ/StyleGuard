from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from routes import corrections
from routes.auth import router as auth_router
import os

"""
StyleGuard API - Main Application Entry Point

This module initializes the FastAPI application and configures the necessary middleware
and routes for the StyleGuard text correction service.
"""

app = FastAPI(
    title="StyleGuard API",
    description="A minimalist text correction API that preserves user dialect and expression style",
    version="1.0.0"
)

# Get URLs from environment variables
api_url = os.getenv('VITE_API_URL', 'http://localhost:9080')
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:9081')

# Configure CORS with specific origins
origins = [
    "http://localhost:9081",    # Docker frontend
    "http://localhost:5173",    # Dev frontend
    "http://localhost:8000",    # API itself
    "http://localhost:9080",    # Docker API
    api_url,                    # External API URL
    frontend_url,               # External Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=86400,  # Cache preflight requests for 24 hours
)

# Exception handlers
@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    """
    Handle database integrity errors (like duplicate emails)
    
    Args:
        request: The request that caused the exception
        exc: The exception raised
        
    Returns:
        JSONResponse: A formatted error response
    """
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Database integrity error. This item may already exist."},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle request validation errors for better error messages
    
    Args:
        request: The request that caused the exception
        exc: The validation exception
        
    Returns:
        JSONResponse: A formatted error response
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": f"Validation error: {str(exc)}"},
    )

# Include all routes
app.include_router(auth_router)
app.include_router(corrections.router)

@app.get("/")
async def root():
    """
    Root endpoint that returns API status information.
    
    Returns:
        dict: A dictionary containing the API status and version information
    """
    return {
        "status": "online",
        "service": "StyleGuard API",
        "version": "1.0.0"
    } 