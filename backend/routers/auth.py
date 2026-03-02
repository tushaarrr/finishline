"""
FinishLine Backend — Auth Router
Handles signup, login, logout, profile retrieval and updates.
All actual auth is delegated to Supabase — these are wrapper routes.
"""
from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional
from database import get_supabase_client, get_supabase_admin
from models.schemas import SignupRequest, LoginRequest, ProfileUpdate, UserProfile, AuthResponse
from config import get_settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Dependency: Extract current user from JWT ─────────────────

async def get_current_user(authorization: str = Header(..., description="Bearer <JWT>")):
    """Validate the JWT from Supabase and return the authenticated user."""
    token = authorization.replace("Bearer ", "")
    
    try:
        supabase = get_supabase_client()
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


# ── POST /auth/signup ─────────────────────────────────────────

@router.post("/signup", status_code=201)
async def signup(request: SignupRequest):
    """Create a new user in Supabase Auth and insert profile into users table."""
    try:
        supabase = get_supabase_client()
        
        # 1. Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "full_name": request.full_name,
                    "country": request.country
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Signup failed — user may already exist")
        
        user = auth_response.user
        
        # 2. Insert into users table using ADMIN client (bypasses RLS)
        #    RLS policy requires auth.uid() = id, which isn't set during
        #    server-side inserts. Service role client bypasses this.
        admin = get_supabase_admin()

        # Auto-detect advisor role from email domain
        role = "advisor" if request.email.endswith("@finishline.com") else "user"

        profile_data = {
            "id": user.id,
            "email": request.email,
            "full_name": request.full_name,
            "country": request.country,
            "role": role,
        }
        
        admin.table("users").insert(profile_data).execute()
        
        # 3. Return tokens + user profile
        return {
            "access_token": auth_response.session.access_token if auth_response.session else None,
            "refresh_token": auth_response.session.refresh_token if auth_response.session else None,
            "user": {
                "id": user.id,
                "email": request.email,
                "full_name": request.full_name,
                "country": request.country,
                "role": role,
            },
            "message": "Account created successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signup error: {str(e)}")


# ── POST /auth/login ─────────────────────────────────────────

@router.post("/login")
async def login(request: LoginRequest):
    """Sign in via Supabase Auth, return JWT tokens."""
    try:
        supabase = get_supabase_client()
        
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })
        
        if not auth_response.user or not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user = auth_response.user
        
        # Fetch full profile from users table
        profile = supabase.table("users").select("*").eq("id", user.id).single().execute()
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user": profile.data if profile.data else {
                "id": user.id,
                "email": user.email,
                "full_name": user.user_metadata.get("full_name", ""),
                "country": user.user_metadata.get("country", ""),
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")


# ── POST /auth/logout ────────────────────────────────────────

@router.post("/logout")
async def logout(current_user=Depends(get_current_user)):
    """Sign out — invalidate the current session."""
    try:
        supabase = get_supabase_client()
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout error: {str(e)}")


# ── GET /auth/me ──────────────────────────────────────────────

@router.get("/me")
async def get_profile(current_user=Depends(get_current_user)):
    """Return current user's profile from the users table."""
    try:
        admin = get_supabase_admin()
        
        profile = admin.table("users").select("*").eq("id", current_user.id).single().execute()
        
        if not profile.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        return profile.data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile fetch error: {str(e)}")


# ── PATCH /auth/me ────────────────────────────────────────────

@router.patch("/me")
async def update_profile(updates: ProfileUpdate, current_user=Depends(get_current_user)):
    """Update user profile fields (name, tax_bracket, country, monthly_income)."""
    try:
        admin = get_supabase_admin()
        
        # Only include non-None fields
        update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = admin.table("users").update(update_data).eq("id", current_user.id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")
        
        return result.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile update error: {str(e)}")
