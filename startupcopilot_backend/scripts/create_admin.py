from pymongo import MongoClient
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user(email: str, password: str):
    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    db = client["startupcopilot"]
    users_collection = db["users"]
    
    # Check if admin already exists
    existing_admin = users_collection.find_one({"email": email})
    if existing_admin:
        print(f"Admin user {email} already exists!")
        return
    
    # Hash the password
    hashed_password = pwd_context.hash(password)
    
    # Create admin user document
    admin_user = {
        "email": email,
        "password": hashed_password,
        "role": "admin",
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    # Insert admin user
    result = users_collection.insert_one(admin_user)
    if result.inserted_id:
        print(f"Successfully created admin user: {email}")
    else:
        print("Failed to create admin user")

if __name__ == "__main__":
    admin_email = input("Enter admin email: ")
    admin_password = input("Enter admin password: ")
    create_admin_user(admin_email, admin_password) 