"""
FinishLine Backend — FastAPI Application Entry Point
Initializes the app, middleware, CORS, and mounts all routers.
"""
# ── Fix SSL for macOS + Supabase (MUST be first) ─────────────
import os, ssl, certifi
_cert = certifi.where()
os.environ["SSL_CERT_FILE"] = _cert
os.environ["REQUESTS_CA_BUNDLE"] = _cert
os.environ["CURL_CA_BUNDLE"] = _cert
ssl._create_default_https_context = lambda purpose=None, cafile=None, capath=None: ssl.create_default_context(cafile=_cert)
# ──────────────────────────────────────────────────────────────
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import get_settings


# ── Lifespan (startup / shutdown) ─────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    print(f"🚀 {settings.app_name} backend starting...")
    print(f"   Supabase: {settings.supabase_url}")
    print(f"   Plaid env: {settings.plaid_env}")
    print(f"   Debug: {settings.debug}")
    yield
    print(f"👋 {settings.app_name} backend shutting down.")


# ── App Init ──────────────────────────────────────────────────

app = FastAPI(
    title="FinishLine API",
    description="AI-native personal CFO — backend API",
    version="1.0.0",
    lifespan=lifespan,
)


# ── CORS ──────────────────────────────────────────────────────

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Mount All Routers ─────────────────────────────────────────

from routers.auth import router as auth_router
from routers.accounts import router as accounts_router
from routers.opportunities import router as opportunities_router
from routers.goals import router as goals_router
from routers.dashboard import router as dashboard_router
from routers.webhooks import router as webhooks_router
from routers.advisor import router as advisor_router
from routers.chat import router as chat_router

app.include_router(auth_router, prefix="/api")
app.include_router(accounts_router, prefix="/api")
app.include_router(opportunities_router, prefix="/api")
app.include_router(goals_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(webhooks_router, prefix="/api")
app.include_router(advisor_router, prefix="/api")
app.include_router(chat_router, prefix="/api")



# ── Health Check ──────────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "ok", "app": "FinishLine", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
