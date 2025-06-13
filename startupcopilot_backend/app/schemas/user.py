# app/schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    is_admin: bool = False
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None         # <— allow updates to password
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None

class UserPasswordUpdate(BaseModel):
    password: str  # (if you ever want a separate endpoint just for changing passwords)

class UserOut(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
