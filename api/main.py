from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import corrections
from routes.auth import router as auth_router

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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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