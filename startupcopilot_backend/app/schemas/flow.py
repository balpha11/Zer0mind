from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ─────────────────────────────────────────────
# Shared Base Schema
# ─────────────────────────────────────────────
class FlowBase(BaseModel):
    name: str
    description: Optional[str] = None
    json_data: dict  # Store nodes/edges JSON directly as an object

# ─────────────────────────────────────────────
# Create Schema
# ─────────────────────────────────────────────
class FlowCreate(FlowBase):
    created_at: Optional[datetime] = None

# ─────────────────────────────────────────────
# Update Schema
# ─────────────────────────────────────────────
class FlowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    json_data: Optional[dict] = None

# ─────────────────────────────────────────────
# Output Schema
# ─────────────────────────────────────────────
class FlowOut(FlowBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
