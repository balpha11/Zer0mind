# app/api/routes_api_keys.py

from bson import ObjectId, errors as bson_errors
from fastapi import APIRouter, HTTPException, status
from typing import List

from app.database.mongo import api_keys_collection
from app.schemas.api_key import ApiKeyCreate, ApiKeyOut, ApiKeyBase

router = APIRouter(prefix="/admin/api-keys", tags=["API Keys"])

def obj_or_404(id: str):
    try:
        obj_id = ObjectId(id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    doc = api_keys_collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=404, detail="API Key not found")

    doc["id"] = str(doc.pop("_id"))
    return doc

@router.post("/", response_model=ApiKeyOut, status_code=status.HTTP_201_CREATED)
def create_api_key(payload: ApiKeyCreate):
    if api_keys_collection.find_one({"name": payload.name}):
        raise HTTPException(status_code=400, detail="API Key with this name exists")
    # Validate type field
    if payload.type not in ["openai", "other"]:  # Add other valid types as needed
        raise HTTPException(status_code=400, detail="Invalid API key type")
    inserted = api_keys_collection.insert_one(payload.dict())
    return obj_or_404(str(inserted.inserted_id))

@router.get("/", response_model=List[ApiKeyOut])
def list_api_keys():
    docs = list(api_keys_collection.find().sort("_id", -1))
    for d in docs:
        d["id"] = str(d.pop("_id"))
    print("API Keys:", docs)  # Debug log
    return docs

@router.get("/{api_key_id}", response_model=ApiKeyOut)
def get_api_key(api_key_id: str):
    return obj_or_404(api_key_id)

@router.put("/{api_key_id}", response_model=ApiKeyOut)
def update_api_key(api_key_id: str, payload: ApiKeyBase):
    update_doc = {k: v for k, v in payload.dict(exclude_none=True).items()}
    if not update_doc:
        raise HTTPException(status_code=400, detail="No fields to update")
    # Validate type field if provided
    if "type" in update_doc and update_doc["type"] not in ["openai", "other"]:
        raise HTTPException(status_code=400, detail="Invalid API key type")
    api_keys_collection.update_one({"_id": ObjectId(api_key_id)}, {"$set": update_doc})
    return obj_or_404(api_key_id)

@router.patch("/{api_key_id}", response_model=ApiKeyOut)
def patch_api_key(api_key_id: str, payload: ApiKeyBase):
    return update_api_key(api_key_id, payload)

@router.delete("/{api_key_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_api_key(api_key_id: str):
    result = api_keys_collection.delete_one({"_id": ObjectId(api_key_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="API Key not found")