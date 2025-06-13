# app/schemas/api_key.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ApiKeyBase(BaseModel):
    name: str
    key: str
    type: str = "openai"  # Add type field with default 'openai'
    model: str = "gpt-4"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_used: Optional[datetime] = None
    is_active: bool = True

class ApiKeyCreate(ApiKeyBase):
    pass

class ApiKeyOut(ApiKeyBase):
    id: str = Field(..., alias="id")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True