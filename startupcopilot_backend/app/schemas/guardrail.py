# app/schemas/guardrail.py
from typing import Optional
from pydantic import BaseModel, Field

class GuardrailBase(BaseModel):
    name: str
    type: str = "Input"            # "Input" | "Output"
    description: str
    logic: str                     # e.g. "check_for_homework"
    enabled: bool = True

class GuardrailCreate(GuardrailBase):
    pass

class GuardrailUpdate(BaseModel):
    # all optional for PATCH / PUT
    name: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    logic: Optional[str] = None
    enabled: Optional[bool] = None

class GuardrailOut(GuardrailBase):
    id: str = Field(..., alias="id")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True