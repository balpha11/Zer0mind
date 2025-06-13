from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.prompt import PromptCreate, PromptUpdate, PromptOut
from app.database.models import Prompt
from typing import List

router = APIRouter(prefix="/api/admin/prompts", tags=["Prompts"])


@router.get("/", response_model=List[PromptOut])
def list_prompts(db: Session = Depends(get_db)):
    return db.query(Prompt).all()


@router.post("/", response_model=PromptOut)
def create_prompt(prompt_data: PromptCreate, db: Session = Depends(get_db)):
    prompt = Prompt(**prompt_data.dict())
    db.add(prompt)
    db.commit()
    db.refresh(prompt)
    return prompt


@router.put("/{prompt_id}", response_model=PromptOut)
def update_prompt(prompt_id: int, prompt_data: PromptUpdate, db: Session = Depends(get_db)):
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    for field, value in prompt_data.dict(exclude_unset=True).items():
        setattr(prompt, field, value)
    db.commit()
    db.refresh(prompt)
    return prompt


@router.delete("/{prompt_id}")
def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    db.delete(prompt)
    db.commit()
    return {"detail": "Prompt deleted successfully"}
