# backend/app/schemas/agent.py
from __future__ import annotations

from typing import Optional, List, Dict, Any
from datetime import datetime

from pydantic import BaseModel, Field


# ─────────────────────────────────────────────
# Base Schema: Shared by Create / Update / Out
# ─────────────────────────────────────────────
class AgentBase(BaseModel):
    # Human-readable metadata
    name: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    version: Optional[str] = "1.0.0"
    status: Optional[str] = "active"          # active | archived | disabled
    type: Optional[str] = "general"           # general | tool | guardrail | tutor

    # LLM configuration
    model: Optional[str] = "gpt-4o-mini"      # defaults; override per-agent if desired
    model_settings: Dict[str, Any] = Field(default_factory=dict)

    # Relationships
    handoffs: List[str] = []                  # list of Handoff IDs
    flow_ids: List[str] = []                  # list of Flow IDs
    tools: List[str] = []                     # list of Tool IDs
    guardrails: List[str] = []                # list of Guardrail IDs

    # Secret reference – stored separately in `api_keys` collection
    openai_api_key_id: Optional[str] = None   # Mongo ObjectId (as string)


# ─────────────────────────────────────────────
# Create Schema
# ─────────────────────────────────────────────
class AgentCreate(AgentBase):
    created_at: Optional[datetime] = None     # auto-set by route if missing


# ─────────────────────────────────────────────
# Update Schema (partial)
# ─────────────────────────────────────────────
class AgentUpdate(BaseModel):
    # Every field is optional because PATCH / PUT can be partial
    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    version: Optional[str] = None
    status: Optional[str] = None
    type: Optional[str] = None

    model: Optional[str] = None
    model_settings: Optional[Dict[str, Any]] = None

    handoffs: Optional[List[str]] = None
    flow_ids: Optional[List[str]] = None
    tools: Optional[List[str]] = None
    guardrails: Optional[List[str]] = None
    openai_api_key_id: Optional[str] = None


# ─────────────────────────────────────────────
# Output Schema
# ─────────────────────────────────────────────
class AgentOut(AgentBase):
    id: str                                   # Mongo ObjectId as string
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True                # enables .from_orm / DB dict usage
