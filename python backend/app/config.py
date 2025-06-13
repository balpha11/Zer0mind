from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache

class Settings(BaseSettings):
    # ───── Core Databases ─────
    MONGO_URI: str = Field(..., description="MongoDB URI")

    # ───── AI Integrations ─────
    OPENAI_API_KEY: str = Field(..., description="OpenAI API key")

    # ───── JWT & Auth Config ─────
    JWT_SECRET: str = Field("super-secret-key", description="JWT secret key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(1440, description="Token expiry in minutes")

    # ───── App Settings ─────
    API_RATE_LIMIT: int = Field(60, description="Requests per minute")
    PROJECT_NAME: str = "StartupCopilot API"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
