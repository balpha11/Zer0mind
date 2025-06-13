# backend/app/schemas/handoff.py

from pydantic import BaseModel, Field
from typing import Optional, Callable, Any, List
from datetime import datetime

# ─────────────────────────────────────────────
# Base Schema: Shared by Create, Update, Output
# ─────────────────────────────────────────────

class HandoffBase(BaseModel):
    agent_id: str = Field(..., description="Target agent ID to hand off to")
    tool_name: Optional[str] = Field(None, description="Optional override for the tool name")
    tool_description: Optional[str] = Field(None, description="Optional override for the tool description")
    input_type: Optional[str] = Field(None, description="Pydantic class path (as a string) for structured input")
    input_filter_name: Optional[str] = Field(None, description="Registered filter function name (string)")
    on_handoff_callback: Optional[str] = Field(None, description="Registered callback name for on_handoff event")
    metadata: Optional[dict[str, Any]] = Field(default_factory=dict)
    created_at: Optional[datetime] = None

# ─────────────────────────────────────────────
# Create Schema
# ─────────────────────────────────────────────

class HandoffCreate(HandoffBase):
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

# ─────────────────────────────────────────────
# Update Schema (Partial/Optional fields)
# ─────────────────────────────────────────────

class HandoffUpdate(BaseModel):
    agent_id: Optional[str] = None
    tool_name: Optional[str] = None
    tool_description: Optional[str] = None
    input_type: Optional[str] = None
    input_filter_name: Optional[str] = None
    on_handoff_callback: Optional[str] = None
    metadata: Optional[dict[str, Any]] = None

# ─────────────────────────────────────────────
# Output Schema
# ─────────────────────────────────────────────

class HandoffOut(HandoffBase):
    id: str = Field(..., alias="id")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True
