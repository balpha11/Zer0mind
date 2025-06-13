from pymongo import MongoClient
from app.config import settings
from functools import lru_cache

@lru_cache()
def get_mongo_client():
    client = MongoClient(settings.MONGO_URI)
    return client["startupcopilot"]  # Return the database directly

# Initialize collections
mongo_db = get_mongo_client()
agents_collection     = mongo_db["agents"]
flows_collection      = mongo_db["flows"]
guardrails_collection = mongo_db["guardrails"]
users_collection      = mongo_db["users"]
tools_collection      = mongo_db["tools"]
api_keys_collection = mongo_db["api_keys"]
plans_collection      = mongo_db["plans"]
settings_collection = mongo_db["settings"]

