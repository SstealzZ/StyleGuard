from pydantic_settings import BaseSettings
from functools import lru_cache

"""
Configuration Settings Module

This module manages the application's configuration settings using environment variables.
It provides a centralized way to access configuration values throughout the application.
"""

class Settings(BaseSettings):
    """
    Application settings class that loads and validates environment variables.
    
    Attributes:
        database_url (str): The SQLite database connection URL
        secret_key (str): Secret key used for JWT token encryption
        algorithm (str): The algorithm used for JWT token generation
        access_token_expire_minutes (int): Token expiration time in minutes
        ollama_api_url (str): URL of the Ollama API endpoint
        model_name (str): Name of the language model to use
    """
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    ollama_api_url: str
    model_name: str

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "protected_namespaces": ("settings_",),
        "extra": "ignore"
    }

@lru_cache()
def get_settings() -> Settings:
    """
    Creates and caches an instance of the Settings class.
    
    Returns:
        Settings: An instance of the Settings class with loaded environment variables
    """
    return Settings() 