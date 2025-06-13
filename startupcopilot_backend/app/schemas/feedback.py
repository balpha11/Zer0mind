from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FeedbackBase(BaseModel):
    user_id: Optional[int] = None
    message: str = Field(..., example="The agent was helpful but slow.")
    rating: Optional[int] = Field(None, ge=1, le=5)


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackOut(FeedbackBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
