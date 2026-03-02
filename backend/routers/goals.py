"""
FinishLine Backend — Goals Router
CRUD for user financial goals with AI-calculated monthly contributions.
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import date, datetime
from routers.auth import get_current_user
from database import get_supabase_admin
from models.schemas import GoalCreate, GoalUpdate

router = APIRouter(prefix="/goals", tags=["Goals"])


def _calculate_monthly_contribution(target: float, current: float, deadline_str: str) -> float:
    """Calculate the monthly contribution needed to reach a goal by its deadline."""
    try:
        deadline = datetime.strptime(deadline_str, "%Y-%m-%d").date()
        today = date.today()
        months_left = max((deadline.year - today.year) * 12 + (deadline.month - today.month), 1)
        remaining = max(target - current, 0)
        return round(remaining / months_left, 2)
    except Exception:
        return 0


# ── GET /goals ────────────────────────────────────────────────

@router.get("")
async def list_goals(current_user=Depends(get_current_user)):
    """List all goals for the current user."""
    try:
        admin = get_supabase_admin()
        result = (
            admin.table("goals")
            .select("*")
            .eq("user_id", current_user.id)
            .order("created_at", desc=True)
            .execute()
        )
        goals = result.data or []
        for g in goals:
            g.pop("user_id", None)
        return {"goals": goals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Goals list error: {str(e)}")


# ── POST /goals ───────────────────────────────────────────────

@router.post("", status_code=201)
async def create_goal(goal: GoalCreate, current_user=Depends(get_current_user)):
    """Create a new goal — AI calculates the monthly contribution needed."""
    try:
        admin = get_supabase_admin()

        monthly = _calculate_monthly_contribution(goal.target_amount, 0, goal.deadline)

        goal_data = {
            "user_id": current_user.id,
            "name": goal.name,
            "type": goal.type,
            "target_amount": goal.target_amount,
            "current_amount": 0,
            "deadline": goal.deadline,
            "monthly_contribution": monthly,
            "status": "active",
        }
        result = admin.table("goals").insert(goal_data).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create goal")

        saved = result.data[0]
        saved.pop("user_id", None)
        return saved

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Goal create error: {str(e)}")


# ── PATCH /goals/:id ──────────────────────────────────────────

@router.patch("/{goal_id}")
async def update_goal(goal_id: str, updates: GoalUpdate, current_user=Depends(get_current_user)):
    """Update a goal's fields. Recalculates monthly contribution if target or deadline changes."""
    try:
        admin = get_supabase_admin()

        # Verify ownership
        existing = (
            admin.table("goals")
            .select("*")
            .eq("id", goal_id)
            .eq("user_id", current_user.id)
            .single()
            .execute()
        )
        if not existing.data:
            raise HTTPException(status_code=404, detail="Goal not found")

        update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        # Recalculate monthly contribution if target or deadline changed
        target = update_data.get("target_amount", existing.data["target_amount"])
        current = update_data.get("current_amount", existing.data["current_amount"])
        deadline = update_data.get("deadline", existing.data["deadline"])
        update_data["monthly_contribution"] = _calculate_monthly_contribution(target, current, deadline)

        result = admin.table("goals").update(update_data).eq("id", goal_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Goal not found")

        saved = result.data[0]
        saved.pop("user_id", None)
        return saved

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Goal update error: {str(e)}")


# ── DELETE /goals/:id ─────────────────────────────────────────

@router.delete("/{goal_id}")
async def delete_goal(goal_id: str, current_user=Depends(get_current_user)):
    """Delete a goal."""
    try:
        admin = get_supabase_admin()

        # Verify ownership
        existing = (
            admin.table("goals")
            .select("id")
            .eq("id", goal_id)
            .eq("user_id", current_user.id)
            .single()
            .execute()
        )
        if not existing.data:
            raise HTTPException(status_code=404, detail="Goal not found")

        admin.table("goals").delete().eq("id", goal_id).execute()
        return {"deleted": True}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Goal delete error: {str(e)}")
