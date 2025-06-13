# app/schemas/log.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LogBase(BaseModel):
    agent_id: int
    user_id: Optional[int] = None
    input_text: str
    output_text: Optional[str] = None

class LogCreate(LogBase):
    pass

class LogOut(LogBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True