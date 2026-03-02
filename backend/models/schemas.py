"""
FinishLine Backend — Pydantic Schemas
Request/Response models for API validation.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


# ── Auth ──────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="Password (min 8 chars)")
    full_name: str = Field(..., description="User's full name")
    country: str = Field(..., description="CA or US")


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    country: Optional[str] = None
    tax_bracket: Optional[float] = None
    monthly_income: Optional[float] = None


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    country: str
    tax_bracket: Optional[float] = None
    monthly_income: Optional[float] = None
    created_at: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserProfile


# ── Accounts ──────────────────────────────────────────────────

class PlaidExchangeRequest(BaseModel):
    public_token: str
    institution_name: str = ""
    account_type: str = "checking"


class ConnectedAccount(BaseModel):
    id: str
    institution_name: str
    account_type: str
    balance: float
    last_synced: Optional[str] = None


# ── Opportunities ─────────────────────────────────────────────

class OpportunityType(str, Enum):
    idle_cash = "idle_cash"
    rrsp_deadline = "rrsp_deadline"
    tfsa_room = "tfsa_room"
    portfolio_drift = "portfolio_drift"
    high_interest_debt = "high_interest_debt"
    salary_optimization = "salary_optimization"


class OpportunityStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    skipped = "skipped"


class Opportunity(BaseModel):
    id: str
    type: OpportunityType
    title: str
    amount: float
    impact_text: str
    impact_value: float
    priority: str
    confidence_score: float
    status: OpportunityStatus = OpportunityStatus.pending
    brief_text: Optional[str] = None
    created_at: Optional[str] = None


# ── Goals ─────────────────────────────────────────────────────

class GoalCreate(BaseModel):
    name: str
    type: str = Field(..., description="retirement | emergency | savings | custom")
    target_amount: float
    deadline: str = Field(..., description="ISO date string")


class GoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[str] = None
    status: Optional[str] = None


class Goal(BaseModel):
    id: str
    name: str
    type: str
    target_amount: float
    current_amount: float = 0
    deadline: str
    monthly_contribution: float = 0
    status: str = "active"


# ── Dashboard ─────────────────────────────────────────────────

class DashboardSummary(BaseModel):
    net_worth: float = 0
    opportunity_count: int = 0
    optimized_this_year: float = 0
    action_rate: float = 0  # percentage of approved vs total
