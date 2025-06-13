# app/utils/constants.py

# Role constants
ROLE_ADMIN = "admin"
ROLE_USER = "user"

# Rate limits per plan (requests per minute)
PLAN_LIMITS = {
    "founder_fuel": 20,
    "scale_up_pro": 60,
    "enterprise_engine": 120
}
