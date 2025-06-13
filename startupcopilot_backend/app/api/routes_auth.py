from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import logging

from app.services.auth_service import authenticate_admin, create_access_token
from app.config import settings
from app.schemas.auth import AdminLoginResponse

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

router = APIRouter(prefix="/admin", tags=["auth"])

# ─────────────────────────────────────────────────────────────
# Admin Login Endpoint
# ─────────────────────────────────────────────────────────────
@router.post("/login", response_model=AdminLoginResponse)
def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate admin and return a JWT access token.
    """
    logger.debug(f"Login attempt with username: '{form_data.username}'")
    admin_user = authenticate_admin(form_data.username, form_data.password)
    if not admin_user:
        logger.debug("Authentication failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin_user["username"], "role": "admin"},
        expires_delta=token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# ─────────────────────────────────────────────────────────────
# OpenAI API Key Access (Optional)
# ─────────────────────────────────────────────────────────────
@router.get("/apikey")
def get_api_key():
    """
    Return the current OpenAI API key from .env
    (Protect with authentication in production).
    """
    return {"openai_api_key": settings.OPENAI_API_KEY}