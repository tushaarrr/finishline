"""
FinishLine Backend — Dashboard Router
Summary endpoint: net worth, opportunity count, optimized this year, action rate.
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import date
from routers.auth import get_current_user
from database import get_supabase_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ── GET /dashboard/summary ────────────────────────────────────

@router.get("/summary")
async def get_dashboard_summary(current_user=Depends(get_current_user)):
    """
    Returns aggregated dashboard data in a single API call:
    - net_worth: sum of all connected account balances
    - opportunity_count: number of pending opportunities
    - optimized_this_year: sum of impact_value from approved opportunities this year
    - action_rate: percentage of approved vs total actioned opportunities
    """
    try:
        admin = get_supabase_admin()

        # 1. Net worth = sum of all account balances
        accounts_result = (
            admin.table("connected_accounts")
            .select("balance")
            .eq("user_id", current_user.id)
            .execute()
        )
        net_worth = sum(a.get("balance", 0) for a in (accounts_result.data or []))

        # 2. Pending opportunity count
        pending_result = (
            admin.table("opportunities")
            .select("id", count="exact")
            .eq("user_id", current_user.id)
            .eq("status", "pending")
            .execute()
        )
        opportunity_count = pending_result.count if pending_result.count else 0

        # 3. Optimized this year = sum of impact_value for approved opps in current year
        year_start = f"{date.today().year}-01-01"
        approved_result = (
            admin.table("opportunities")
            .select("impact_value")
            .eq("user_id", current_user.id)
            .eq("status", "approved")
            .gte("created_at", year_start)
            .execute()
        )
        optimized_this_year = sum(o.get("impact_value", 0) for o in (approved_result.data or []))

        # 4. Action rate = approved / total actions
        all_actions = (
            admin.table("user_actions")
            .select("decision")
            .eq("user_id", current_user.id)
            .execute()
        )
        total_actions = len(all_actions.data or [])
        approved_actions = len([a for a in (all_actions.data or []) if a["decision"] == "approved"])
        action_rate = round((approved_actions / total_actions * 100), 1) if total_actions > 0 else 0

        return {
            "net_worth": round(net_worth, 2),
            "opportunity_count": opportunity_count,
            "optimized_this_year": round(optimized_this_year, 2),
            "action_rate": action_rate,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard error: {str(e)}")
