from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.database.mongo import users_collection
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.services.auth_service import create_access_token
from app.config import settings

from typing import List
from datetime import datetime, timedelta
from bson import ObjectId
from passlib.context import CryptContext

router = APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Helper function to convert MongoDB _id to string
def convert_mongo_id(user):
    user["id"] = str(user.pop("_id"))
    return user

# ─────────────────────────────────────────────────────────────
# Get All Users
# ─────────────────────────────────────────────────────────────
@router.get("/users", response_model=List[UserOut])
async def get_users(skip: int = 0, limit: int = 100):
    users = list(users_collection.find().skip(skip).limit(limit))
    return [convert_mongo_id(user) for user in users]

# ─────────────────────────────────────────────────────────────
# Create User (Signup)
# ─────────────────────────────────────────────────────────────
@router.post("/users", response_model=UserOut)
async def create_user(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data = user.dict()
    user_data["password"] = pwd_context.hash(user_data["password"])
    user_data["created_at"] = datetime.utcnow()
    user_data["is_active"] = True
    user_data["is_admin"] = False

    result = users_collection.insert_one(user_data)
    created_user = users_collection.find_one({"_id": result.inserted_id})
    return convert_mongo_id(created_user)

# ─────────────────────────────────────────────────────────────
# Get Single User by ID
# ─────────────────────────────────────────────────────────────
@router.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: str):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return convert_mongo_id(user)

# ─────────────────────────────────────────────────────────────
# Update User by ID
# ─────────────────────────────────────────────────────────────
@router.put("/users/{user_id}", response_model=UserOut)
async def update_user(user_id: str, updates: UserUpdate):
    try:
        update_data = {k: v for k, v in updates.dict(exclude_unset=True).items()}
        if "password" in update_data:
            update_data["password"] = pwd_context.hash(update_data["password"])

        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
        return convert_mongo_id(updated_user)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID or data")

# ─────────────────────────────────────────────────────────────
# Delete User by ID
# ─────────────────────────────────────────────────────────────
@router.delete("/users/{user_id}")
async def delete_user(user_id: str):
    try:
        result = users_collection.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"detail": "User deleted"}
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID")

# ─────────────────────────────────────────────────────────────
# User Login Endpoint (JWT Auth)
# ─────────────────────────────────────────────────────────────
@router.post("/user-login")
def user_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({
        "email": form_data.username,
        "is_active": True
    })

    if not user or not pwd_context.verify(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": "user"},
        expires_delta=token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
