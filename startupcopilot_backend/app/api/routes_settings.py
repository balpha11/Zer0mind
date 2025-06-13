from fastapi import APIRouter, HTTPException
from app.database.mongo import settings_collection
from app.schemas.settings import GeneralSettings, NotificationSettings, SecuritySettings, MaintenanceSettings, PaymentSettings

router = APIRouter(prefix="/admin/settings", tags=["Settings"])

@router.get("/general", response_model=GeneralSettings)
async def get_general_settings():
    settings = settings_collection.find_one({"type": "general"}) or {"siteName": "Zer0Mind AI"}
    return settings

@router.post("/general", response_model=GeneralSettings)
async def save_general_settings(settings: GeneralSettings):
    settings_collection.update_one({"type": "general"}, {"$set": settings.dict()}, upsert=True)
    return settings

@router.get("/notifications", response_model=NotificationSettings)
async def get_notification_settings():
    settings = settings_collection.find_one({"type": "notifications"}) or {"adminEmail": "admin@Zer0Mind.ai", "emailNotifications": True}
    return settings

@router.post("/notifications", response_model=NotificationSettings)
async def save_notification_settings(settings: NotificationSettings):
    settings_collection.update_one({"type": "notifications"}, {"$set": settings.dict()}, upsert=True)
    return settings

@router.get("/security", response_model=SecuritySettings)
async def get_security_settings():
    settings = settings_collection.find_one({"type": "security"}) or {"enable2FA": False, "ipWhitelist": None}
    return settings

@router.post("/security", response_model=SecuritySettings)
async def save_security_settings(settings: SecuritySettings):
    settings_collection.update_one({"type": "security"}, {"$set": settings.dict()}, upsert=True)
    return settings

@router.get("/maintenance", response_model=MaintenanceSettings)
async def get_maintenance_settings():
    settings = settings_collection.find_one({"type": "maintenance"}) or {"enabled": False, "message": None, "endTime": None, "allowAdminAccess": False}
    return settings

@router.post("/maintenance", response_model=MaintenanceSettings)
async def save_maintenance_settings(settings: MaintenanceSettings):
    settings_collection.update_one({"type": "maintenance"}, {"$set": settings.dict()}, upsert=True)
    return settings

@router.get("/payments", response_model=PaymentSettings)
async def get_payment_settings():
    settings = settings_collection.find_one({"type": "payments"}) or {
        "stripeEnabled": False,
        "stripePublishableKey": None,
        "stripeSecretKey": None,
        "paypalEnabled": False,
        "paypalClientId": None,
        "paypalSecret": None
    }
    return settings

@router.post("/payments", response_model=PaymentSettings)
async def save_payment_settings(settings: PaymentSettings):
    settings_collection.update_one({"type": "payments"}, {"$set": settings.dict()}, upsert=True)
    return settings