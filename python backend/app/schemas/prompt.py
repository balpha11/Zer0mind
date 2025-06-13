# app/schemas/prompt.py
from pydantic import BaseModel
from typing import Optional

class PromptBase(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    tags: Optional[str] = None  # Comma-separated tags

class PromptCreate(PromptBase):
    pass

class PromptUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None

class PromptOut(PromptBase):
    id: int

    class Config:
        orm_mode = True
