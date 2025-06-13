# app/services/plan_service.py

from sqlalchemy.orm import Session
from app.database.models import Plan, User
from fastapi import HTTPException

def get_plan_by_id(db: Session, plan_id: int):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return plan

def get_all_plans(db: Session):
    return db.query(Plan).all()

def create_plan(db: Session, name: str, limit_rpm: int, description: str = ""):
    new_plan = Plan(name=name, limit_rpm=limit_rpm, description=description)
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return new_plan

def update_plan(db: Session, plan_id: int, name: str = None, limit_rpm: int = None, description: str = None):
    plan = get_plan_by_id(db, plan_id)
    if name:
        plan.name = name
    if limit_rpm is not None:
        plan.limit_rpm = limit_rpm
    if description:
        plan.description = description
    db.commit()
    db.refresh(plan)
    return plan

def delete_plan(db: Session, plan_id: int):
    plan = get_plan_by_id(db, plan_id)
    db.delete(plan)
    db.commit()
    return {"message": f"Plan {plan_id} deleted"}

def get_user_plan_limit(db: Session, user_id: int) -> int:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.plan and user.plan.limit_rpm:
        return user.plan.limit_rpm
    return 60  # default RPM if plan not set
