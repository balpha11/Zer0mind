from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from bson import ObjectId, errors as bson_errors
from app.schemas.plan import PlanCreate, PlanUpdate, PlanOut
from app.database.mongo import plans_collection

router = APIRouter()

@router.get("/plans", response_model=List[PlanOut], tags=["Plans"])
def get_all_plans():
    """
    Retrieve all pricing plans (public endpoint).
    """
    plans = list(plans_collection.find({}))
    for plan in plans:
        plan["id"] = str(plan["_id"])
        del plan["_id"]
        plan.setdefault("features", [])
    return plans

@router.post("/admin/plans", response_model=PlanOut, tags=["Plans"])
def create_plan(plan_data: PlanCreate):
    """
    Create a new pricing plan (admin-only).
    """
    if plans_collection.find_one({"name": plan_data.name}):
        raise HTTPException(status_code=400, detail="Plan with this name already exists")

    now = datetime.utcnow()
    record = {
        **plan_data.dict(exclude_unset=True),
        "features": plan_data.features or [],
        "created_at": now,
    }

    result = plans_collection.insert_one(record)
    inserted_id = str(result.inserted_id)

    return {
        "id": inserted_id,
        "name": plan_data.name,
        "description": plan_data.description,
        "price": plan_data.price,
        "rate_limit": plan_data.rate_limit,
        "daily_limit": plan_data.daily_limit,
        "features": plan_data.features or [],
        "is_popular": plan_data.is_popular,
        "cta": plan_data.cta,
        "created_at": now,
    }

@router.put("/admin/plans/{plan_id}", response_model=PlanOut, tags=["Plans"])
def update_plan(plan_id: str, plan_data: PlanUpdate):
    """
    Update an existing pricing plan (admin-only).
    """
    try:
        object_id = ObjectId(plan_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid plan ID")

    existing = plans_collection.find_one({"_id": object_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Plan not found")

    update_doc = plan_data.dict(exclude_unset=True)
    plans_collection.update_one(
        {"_id": object_id},
        {"$set": update_doc}
    )

    updated = plans_collection.find_one({"_id": object_id})
    updated.setdefault("features", [])

    return {
        "id": str(updated["_id"]),
        "name": updated.get("name"),
        "description": updated.get("description"),
        "price": updated.get("price"),
        "rate_limit": updated.get("rate_limit"),
        "daily_limit": updated.get("daily_limit"),
        "features": updated.get("features", []),
        "is_popular": updated.get("is_popular", False),
        "cta": updated.get("cta"),
        "created_at": updated.get("created_at"),
    }

@router.delete("/admin/plans/{plan_id}", tags=["Plans"])
def delete_plan(plan_id: str):
    """
    Delete a pricing plan (admin-only).
    """
    try:
        object_id = ObjectId(plan_id)
    except bson_errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid plan ID")

    result = plans_collection.delete_one({"_id": object_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plan not found")

    return {"message": "Plan deleted successfully"}

@router.put("/admin/plans/bulk-update", response_model=List[PlanOut], tags=["Plans"])
def bulk_update_plans(plans: List[PlanUpdate]):
    """
    Bulk update multiple pricing plans (admin-only).
    """
    updated_plans = []
    for plan_data in plans:
        if not plan_data.id:
            raise HTTPException(status_code=400, detail="Plan ID is required for updates")

        try:
            object_id = ObjectId(plan_data.id)
        except bson_errors.InvalidId:
            raise HTTPException(status_code=400, detail=f"Invalid plan ID: {plan_data.id}")

        existing = plans_collection.find_one({"_id": object_id})
        if not existing:
            raise HTTPException(status_code=404, detail=f"Plan not found: {plan_data.id}")

        update_doc = plan_data.dict(exclude_unset=True)
        plans_collection.update_one(
            {"_id": object_id},
            {"$set": update_doc}
        )

        updated = plans_collection.find_one({"_id": object_id})
        updated.setdefault("features", [])
        updated_plans.append({
            "id": str(updated["_id"]),
            "name": updated.get("name"),
            "description": updated.get("description"),
            "price": updated.get("price"),
            "rate_limit": updated.get("rate_limit"),
            "daily_limit": updated.get("daily_limit"),
            "features": updated.get("features", []),
            "is_popular": updated.get("is_popular", False),
            "cta": updated.get("cta"),
            "created_at": updated.get("created_at"),
        })

    return updated_plans