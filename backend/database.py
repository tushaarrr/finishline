"""
FinishLine Backend — Database Client
Initializes the Supabase Python client (singleton).
"""
from supabase import create_client, Client
from config import get_settings


def get_supabase_client() -> Client:
    """Returns the Supabase client using the anon key (respects RLS)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)


def get_supabase_admin() -> Client:
    """Returns the Supabase client using the service key (bypasses RLS).
    Use ONLY for server-side admin operations like creating user profiles."""
    settings = get_settings()
    if not settings.supabase_service_key:
        raise ValueError("SUPABASE_SERVICE_KEY is not set. Required for admin operations.")
    return create_client(settings.supabase_url, settings.supabase_service_key)


# Singleton instances
supabase: Client = get_supabase_client()
