from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging, os

# ─── Route modules ──────────────────────────────────────────
from app.api import (
    routes_agents,
    routes_flows,
    routes_auth,
    routes_guardrails,
    routes_users,
    routes_tools,
    routes_api_keys,
    routes_chat,
    routes_plans,
    routes_settings,  # NEW: Added for settings endpoints
)

# ─── DB client ──────────────────────────────────────────────
from app.database.mongo import get_mongo_client

# ─── Logging ────────────────────────────────────────────────
logging.basicConfig(level=logging.DEBUG if os.getenv("DEBUG", "False").lower() == "true" else logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="StartupCopilot API",
    version="1.0.0",
    description="AI agent backend to support startups and enterprise workflows",
)

# ─── CORS (tightened for localhost frontend) ────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Custom exception handlers ──────────────────────────────
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTPException: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={"Access-Control-Allow-Origin": "http://localhost:5173"},
    )

@app.exception_handler(Exception)
async def custom_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
        headers={"Access-Control-Allow-Origin": "http://localhost:5173"},
    )

# ─── Router registration ───────────────────────────────────

## Admin-only
app.include_router(routes_agents.router,    prefix="/api/admin/agents", tags=["Agents"])
app.include_router(routes_flows.router,     prefix="/api/admin/flows",  tags=["Flows"])
app.include_router(routes_users.router,     prefix="/api/admin/users",  tags=["Users (Admin)"])
app.include_router(routes_tools.router,     prefix="/api/admin/tools",  tags=["Tools"])

## General / public
app.include_router(routes_auth.router,      prefix="/api", tags=["Auth"])
app.include_router(routes_guardrails.router,prefix="/api", tags=["Guardrails"])
app.include_router(routes_api_keys.router,  prefix="/api", tags=["API Keys"])
app.include_router(routes_chat.router,      prefix="/api", tags=["Chat"])
app.include_router(routes_users.router,     prefix="/api", tags=["Users"])
app.include_router(routes_plans.router,     prefix="/api", tags=["Plans"])
app.include_router(routes_settings.router,  prefix="/api", tags=["Settings"])  # NEW: Settings router

# ─── Lifecycle hooks ───────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    db = get_mongo_client()
    collections = db.list_collection_names()
    if "plans" not in collections:
        db.create_collection("plans")  # Ensure singleton init
    if "settings" not in collections:
        db.create_collection("settings")  # NEW: Ensure settings collection

@app.on_event("shutdown")
async def shutdown_event():
    get_mongo_client().close()

# ─── Healthcheck ────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"message": "🚀 StartupCopilot API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")