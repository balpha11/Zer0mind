from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from app.schemas.flow import FlowCreate, FlowUpdate, FlowOut
from app.database.mongo import flows_collection
from bson import ObjectId, errors as bson_errors

router = APIRouter(tags=["flows"])

# Utility to validate ObjectId
def validate_objectid(id: str):
    try:
        return ObjectId(id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid flow ID format")


# ─────────────────────────────────────────────
# List All Flows
# ─────────────────────────────────────────────
@router.get("/", response_model=List[FlowOut])
def list_flows():
    flows = list(flows_collection.find({}, {
        "_id": 1,
        "name": 1,
        "description": 1,
        "json_data": 1,
        "created_at": 1
    }))

    for flow in flows:
        flow["id"] = str(flow["_id"])
        del flow["_id"]
    return flows


# ─────────────────────────────────────────────
# Create Flow
# ─────────────────────────────────────────────
@router.post("/", response_model=FlowOut)
def create_flow(flow_data: FlowCreate):
    now = datetime.utcnow()
    record = {
        **flow_data.dict(),
        "created_at": now
    }

    result = flows_collection.insert_one(record)
    inserted_id = str(result.inserted_id)

    return {
        "id": inserted_id,
        **flow_data.dict(),
        "created_at": now
    }


# ─────────────────────────────────────────────
# Get Flow by ID
# ─────────────────────────────────────────────
@router.get("/{flow_id}", response_model=FlowOut)
def get_flow(flow_id: str):
    object_id = validate_objectid(flow_id)
    flow = flows_collection.find_one({"_id": object_id})

    if not flow:
        raise HTTPException(status_code=404, detail="Flow not found")

    return {
        "id": str(flow["_id"]),
        "name": flow["name"],
        "description": flow.get("description"),
        "json_data": flow["json_data"],
        "created_at": flow.get("created_at")
    }


# ─────────────────────────────────────────────
# Update Flow
# ─────────────────────────────────────────────
@router.put("/{flow_id}", response_model=FlowOut)
def update_flow(flow_id: str, flow_data: FlowUpdate):
    object_id = validate_objectid(flow_id)

    existing = flows_collection.find_one({"_id": object_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Flow not found")

    flows_collection.update_one(
        {"_id": object_id},
        {"$set": flow_data.dict(exclude_unset=True)}
    )

    updated = flows_collection.find_one({"_id": object_id})

    return {
        "id": str(updated["_id"]),
        "name": updated["name"],
        "description": updated.get("description"),
        "json_data": updated["json_data"],
        "created_at": updated.get("created_at")
    }


# ─────────────────────────────────────────────
# Delete Flow
# ─────────────────────────────────────────────
@router.delete("/{flow_id}")
def delete_flow(flow_id: str):
    object_id = validate_objectid(flow_id)
    result = flows_collection.delete_one({"_id": object_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Flow not found")

    return {"message": "Flow deleted successfully"}
