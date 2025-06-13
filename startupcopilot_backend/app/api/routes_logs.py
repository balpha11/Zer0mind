from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.log import RunLogOut
from app.database.models import RunLog
from typing import List

router = APIRouter(prefix="/api/admin/logs", tags=["Run Logs"])

@router.get("/", response_model=List[RunLogOut])
def get_all_logs(db: Session = Depends(get_db)):
    return db.query(RunLog).order_by(RunLog.created_at.desc()).all()


@router.get("/{log_id}", response_model=RunLogOut)
def get_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(RunLog).filter(RunLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log


@router.delete("/{log_id}")
def delete_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(RunLog).filter(RunLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"message": "Log deleted successfully"}
