# StyleGuard API

A minimalist text correction API that preserves user dialect and expression style.

## Features

- User authentication and authorization
- Text correction with style preservation
- Correction history tracking
- Integration with Ollama language models

## Prerequisites

- Python 3.8+
- Ollama server running locally or remotely
- SQLite database

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your specific configuration.

## Running the API

Development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
api/
├── main.py           # Main application entry point
├── config.py         # Configuration settings
├── database.py       # Database configuration and session
├── models/          # SQLAlchemy models
├── schemas/         # Pydantic schemas
├── routes/          # API routes
├── services/        # Business logic
└── utils/           # Utility functions
```

## Environment Variables

- `DATABASE_URL`: SQLite database connection URL
- `SECRET_KEY`: Secret key for JWT token encryption
- `ALGORITHM`: Algorithm used for JWT tokens
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
- `OLLAMA_API_URL`: URL of the Ollama API endpoint
- `MODEL_NAME`: Name of the language model to use 