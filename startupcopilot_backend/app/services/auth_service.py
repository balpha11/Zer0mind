from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import logging

from app.database.mongo import get_mongo_client
from app.config import settings

# ─────────────────────────────────────────────────────────────
# Logging Configuration
# ─────────────────────────────────────────────────────────────
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# ─────────────────────────────────────────────────────────────
# Password Hashing Context (bcrypt)
# ─────────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─────────────────────────────────────────────────────────────
# JWT Configuration
# ─────────────────────────────────────────────────────────────
SECRET_KEY = settings.JWT_SECRET
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

# ─────────────────────────────────────────────────────────────
# OAuth2 Password Bearer Dependency
# ─────────────────────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

# ─────────────────────────────────────────────────────────────
# Token Generator
# ─────────────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ─────────────────────────────────────────────────────────────
# Admin Authenticator
# ─────────────────────────────────────────────────────────────
def authenticate_admin(username: str, password: str):
    db = get_mongo_client()
    logger.debug(f"Querying users collection for email: '{username}', is_admin: true, is_active: true")
    
    admin = db["users"].find_one({
        "email": username,
        "is_admin": True,
        "is_active": True
    })

    if not admin:
        logger.debug("No active admin user found with given email")
        return None

    if not pwd_context.verify(password, admin["password"]):
        logger.debug(f"Password verification failed for {admin['email']}")
        return None

    logger.debug(f"Admin authenticated: {admin['email']}")
    return {"username": admin["email"]}

# ─────────────────────────────────────────────────────────────
# JWT Verifier
# ─────────────────────────────────────────────────────────────
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        db = get_mongo_client()
        user = db["users"].find_one({
            "email": email,
            "is_admin": True,
            "is_active": True
        })

        if not user:
            raise HTTPException(status_code=401, detail="Active admin user not found")
        return user

    except JWTError as e:
        logger.warning(f"Token decode failed: {e}")
        raise HTTPException(status_code=403, detail="Token invalid or expired")

# ─────────────────────────────────────────────────────────────
# FastAPI Dependency: Get Current Admin User
# ─────────────────────────────────────────────────────────────
def get_current_user(token: str = Depends(oauth2_scheme)):
    return verify_token(token)
