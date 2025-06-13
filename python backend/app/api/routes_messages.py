from fastapi import APIRouter, HTTPException
from app.database.mongo import messages_collection
from app.schemas.message import MessageCreate, MessageOut
from datetime import datetime
from typing import List, Optional

router = APIRouter(prefix="/api/messages", tags=["Messages"])

@router.post("", response_model=MessageOut)
async def send_message(message: MessageCreate):
    # Validate session_id or email
    if not message.email and not message.session_id:
        raise HTTPException(status_code=400, detail="Email or session_id required")
    
    identifier = message.session_id if message.session_id else message.email
    is_anonymous = bool(message.session_id)

    # Check message limits for free users (anonymous or logged-in)
    message_count = messages_collection.count_documents({
        "$or": [{"email": identifier}, {"session_id": identifier}],
        "created_at": {"$gte": datetime.utcnow().replace(day=1)}
    })
    if is_anonymous or message.plan == "free":
        if message_count >= 5:
            raise HTTPException(status_code=403, detail="Monthly message limit reached (5 messages)")
        if len(message.text.split()) > 500:
            raise HTTPException(status_code=403, detail="Message exceeds 500-word limit for free plan")

    message_data = message.dict(exclude_unset=True)
    message_data["created_at"] = datetime.utcnow()
    message_data["is_user"] = True
    result = messages_collection.insert_one(message_data)
    created_message = messages_collection.find_one({"_id": result.inserted_id})
    return created_message

@router.get("", response_model=List[MessageOut])
async def get_messages(email: Optional[str] = None, session_id: Optional[str] = None):
    if not email and not session_id:
        raise HTTPException(status_code=400, detail="Email or session_id required")
    identifier = session_id if session_id else email
    messages = list(messages_collection.find({"$or": [{"email": identifier}, {"session_id": identifier}]}))
    return messages