from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class GeneralSettings(BaseModel):
    siteName: str

class NotificationSettings(BaseModel):
    adminEmail: EmailStr
    emailNotifications: bool

class SecuritySettings(BaseModel):
    twoFactorEnabled: bool = False
    ipWhitelistEnabled: bool = False
    ipWhitelist: List[str] = []
    googleAuthEnabled: bool = False
    googleAuthClientId: Optional[str] = None
    googleAuthClientSecret: Optional[str] = None
    auditTrailEnabled: bool = False
    auditRetentionDays: int = 30

class MaintenanceSettings(BaseModel):
    enabled: bool = False
    message: Optional[str] = None
    endTime: Optional[datetime] = None
    allowAdminAccess: bool = False

class PaymentSettings(BaseModel):
    stripeEnabled: bool = False
    stripePublishableKey: Optional[str] = None
    stripeSecretKey: Optional[str] = None
    paypalEnabled: bool = False
    paypalClientId: Optional[str] = None
    paypalSecret: Optional[str] = None