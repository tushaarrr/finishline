"""
FinishLine Backend — Configuration
Loads all environment variables via pydantic-settings.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── Supabase ──────────────────────────────────────────────
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str = ""  # Optional for MVP, needed for admin ops

    # ── Plaid ─────────────────────────────────────────────────
    plaid_client_id: str
    plaid_secret: str
    plaid_env: str = "sandbox"

    # ── Anthropic (Claude) ────────────────────────────────────
    anthropic_api_key: str

    # ── OpenAI (Embeddings only) ──────────────────────────────
    openai_api_key: str = ""  # Only for text-embedding-3-small

    # ── Alpha Vantage (Stock quotes) ──────────────────────────
    alpha_vantage_api_key: str = ""  # Optional — for stock data in chat

    # ── App ───────────────────────────────────────────────────
    app_name: str = "FinishLine"
    debug: bool = True
    frontend_url: str = "http://localhost:5173"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


@lru_cache()
def get_settings() -> Settings:
    return Settings()
