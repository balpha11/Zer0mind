from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# ─────────────────────────────────────────────
# Base Schema: Shared by Create / Update / Out
# ─────────────────────────────────────────────
class PlanBase(BaseModel):
    name: str = Field(..., description="Unique name of the pricing plan")
    description: Optional[str] = Field(None, description="Brief description of the plan")
    price: Optional[float] = Field(None, description="Price in USD", ge=0)
    rate_limit: Optional[int] = Field(None, description="Requests per minute", ge=0)
    daily_limit: Optional[int] = Field(None, description="Daily request limit (null for unlimited)", ge=0)
    features: List[str] = Field(default_factory=list, description="List of plan features")
    is_popular: bool = Field(False, description="Mark as popular plan")
    cta: Optional[str] = Field(None, description="Call-to-action label, e.g., 'Upgrade now'")

# ─────────────────────────────────────────────
# Create Schema
# ─────────────────────────────────────────────
class PlanCreate(PlanBase):
    created_at: Optional[datetime] = Field(None, description="Creation timestamp, auto-set by backend")

# ─────────────────────────────────────────────
# Update Schema (partial)
# ─────────────────────────────────────────────
class PlanUpdate(BaseModel):
    id: Optional[str] = Field(None, description="MongoDB ObjectId as string")
    name: Optional[str] = Field(None, description="Unique name of the pricing plan")
    description: Optional[str] = Field(None, description="Brief description of the plan")
    price: Optional[float] = Field(None, description="Price in USD", ge=0)
    rate_limit: Optional[int] = Field(None, description="Requests per minute", ge=0)
    daily_limit: Optional[int] = Field(None, description="Daily request limit (null for unlimited)", ge=0)
    features: Optional[List[str]] = Field(None, description="List of plan features")
    is_popular: Optional[bool] = Field(None, description="Mark as popular plan")
    cta: Optional[str] = Field(None, description="Call-to-action label, e.g., 'Upgrade now'")

# ─────────────────────────────────────────────
# Output Schema
# ─────────────────────────────────────────────
class PlanOut(PlanBase):
    id: str = Field(..., description="MongoDB ObjectId as string")
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")

    class Config:
        from_attributes = True