from pydantic import BaseModel, EmailStr, Field


# ─────────────────────────────────────────────────────────────
# Request Schema for Login
# ─────────────────────────────────────────────────────────────

class AdminLoginRequest(BaseModel):
    username: EmailStr = Field(..., description="Admin email address")
    password: str = Field(..., min_length=4, description="Admin password")


# ─────────────────────────────────────────────────────────────
# Response Schema after Login
# ─────────────────────────────────────────────────────────────

class AdminLoginResponse(BaseModel):
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type (always 'bearer')")
