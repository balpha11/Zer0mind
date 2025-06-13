# app/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.auth_service import verify_api_key

api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=False)

def get_api_key(api_key: str = Depends(api_key_header)):
    if not verify_api_key(api_key):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing API Key"
        )
    return api_key

def get_db_session() -> Session:
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()
