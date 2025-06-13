from bson import ObjectId, errors as bson_errors
from fastapi import APIRouter, HTTPException, status
from typing import List

from app.database.mongo import guardrails_collection
from app.schemas.guardrail import GuardrailCreate, GuardrailUpdate, GuardrailOut

router = APIRouter(prefix="/guardrails", tags=["guardrails"])

# ───────────────────────────────────────────────────────────
# Helpers
# ───────────────────────────────────────────────────────────
def obj_or_404(id: str):
    try:
        obj_id = ObjectId(id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    doc = guardrails_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Guardrail not found")
    doc["id"] = str(doc.pop("_id"))
    return doc

# ───────────────────────────────────────────────────────────
# CRUD
# ───────────────────────────────────────────────────────────
@router.post("/", response_model=GuardrailOut, status_code=status.HTTP_201_CREATED)
def create_guardrail(payload: GuardrailCreate):
    # Validate type
    if payload.type not in ["Input", "Output"]:
        raise HTTPException(status_code=400, detail="Type must be 'Input' or 'Output'")
    
    # Simple uniqueness check on name
    if guardrails_collection.find_one({"name": payload.name}):
        raise HTTPException(status_code=400, detail="Guardrail with this name already exists")

    inserted = guardrails_collection.insert_one(payload.dict())
    return obj_or_404(str(inserted.inserted_id))

@router.get("/", response_model=List[GuardrailOut])
def list_guardrails():
    docs = list(guardrails_collection.find().sort("_id", -1))
    for d in docs:
        d["id"] = str(d.pop("_id"))
    return docs

@router.get("/{guardrail_id}", response_model=GuardrailOut)
def get_guardrail(guardrail_id: str):
    return obj_or_404(guardrail_id)

@router.put("/{guardrail_id}", response_model=GuardrailOut)
def update_guardrail(guardrail_id: str, payload: GuardrailUpdate):
    update_doc = {k: v for k, v in payload.dict(exclude_none=True).items()}
    if not update_doc:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Validate type if provided
    if "type" in update_doc and update_doc["type"] not in ["Input", "Output"]:
        raise HTTPException(status_code=400, detail="Type must be 'Input' or 'Output'")

    result = guardrails_collection.update_one(
        {"_id": ObjectId(guardrail_id)}, {"$set": update_doc}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Guardrail not found")
    
    return obj_or_404(guardrail_id)

@router.patch("/{guardrail_id}", response_model=GuardrailOut)
def patch_guardrail(guardrail_id: str, payload: GuardrailUpdate):
    # Identical to PUT but kept separate for semantic clarity
    return update_guardrail(guardrail_id, payload)

@router.delete("/{guardrail_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_guardrail(guardrail_id: str):
    result = guardrails_collection.delete_one({"_id": ObjectId(guardrail_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Guardrail not found")