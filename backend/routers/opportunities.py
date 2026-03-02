"""
FinishLine Backend — Opportunities Router
Scan for opportunities, list pending, approve, skip.
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import date, timedelta
from routers.auth import get_current_user
from database import get_supabase_admin
from services.detector import OpportunityDetector
from services.ai_engine import generate_brief
from services.rag_service import get_relevant_context

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

detector = OpportunityDetector()


# ── POST /opportunities/scan ──────────────────────────────────

@router.post("/scan")
async def scan_opportunities(current_user=Depends(get_current_user)):
    """
    Run the full opportunity detection pipeline:
    1. Fetch user profile, accounts, and transactions
    2. Run all detectors
    3. Save opportunities to DB
    4. Generate Claude briefs for each
    5. Save briefs to action_briefs table
    """
    try:
        admin = get_supabase_admin()

        # 1. Get user profile
        user_result = admin.table("users").select("*").eq("id", current_user.id).single().execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        user_profile = user_result.data

        # 2. Get all connected accounts
        accounts_result = (
            admin.table("connected_accounts")
            .select("*")
            .eq("user_id", current_user.id)
            .execute()
        )
        accounts = accounts_result.data or []

        if not accounts:
            return {"opportunities": [], "message": "No connected accounts — connect a bank first"}

        # 3. Get last 90 days of transactions
        ninety_days_ago = (date.today() - timedelta(days=90)).isoformat()
        txn_result = (
            admin.table("transactions")
            .select("*")
            .eq("user_id", current_user.id)
            .gte("date", ninety_days_ago)
            .execute()
        )
        transactions = txn_result.data or []

        # 4. Check for existing pending opportunities (max 3 per day)
        today_str = date.today().isoformat()
        existing = (
            admin.table("opportunities")
            .select("type")
            .eq("user_id", current_user.id)
            .eq("status", "pending")
            .gte("created_at", today_str)
            .execute()
        )
        existing_types = [o["type"] for o in (existing.data or [])]

        # 5. Run detectors
        raw_opportunities = detector.run_all_detectors(user_profile, accounts, transactions)

        # Filter out types that already have a pending opportunity today
        new_opportunities = [o for o in raw_opportunities if o["type"] not in existing_types]

        # 6. Save each opportunity + generate brief
        saved = []
        for opp in new_opportunities:
            # Insert opportunity
            opp_data = {**opp, "user_id": current_user.id}
            opp_result = admin.table("opportunities").insert(opp_data).execute()
            if not opp_result.data:
                continue
            saved_opp = opp_result.data[0]

            # Generate Claude brief
            try:
                rag_context = get_relevant_context(opp["type"], user_profile.get("country", "CA"))
                brief_text = generate_brief(opp, user_profile, rag_context)

                # Save brief
                admin.table("action_briefs").insert({
                    "opportunity_id": saved_opp["id"],
                    "brief_text": brief_text,
                    "model_used": "claude-sonnet-4-5",
                }).execute()

                saved_opp["brief_text"] = brief_text
            except Exception as e:
                print(f"Brief generation error: {e}")
                saved_opp["brief_text"] = opp.get("impact_text", "")

            # Don't leak internal fields
            saved_opp.pop("user_id", None)
            saved.append(saved_opp)

        return {"opportunities": saved, "count": len(saved)}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan error: {str(e)}")


# ── GET /opportunities ────────────────────────────────────────

@router.get("")
async def list_opportunities(status: str = "pending", current_user=Depends(get_current_user)):
    """Get opportunities for the current user. Use status=all for history."""
    try:
        admin = get_supabase_admin()

        # Build query
        query = (
            admin.table("opportunities")
            .select("*")
            .eq("user_id", current_user.id)
        )

        # Filter by status unless 'all'
        if status != "all":
            query = query.eq("status", status)

        opps_result = query.order("created_at", desc=True).execute()
        opportunities = opps_result.data or []

        # Attach briefs
        for opp in opportunities:
            brief_result = (
                admin.table("action_briefs")
                .select("brief_text")
                .eq("opportunity_id", opp["id"])
                .limit(1)
                .execute()
            )
            opp["brief_text"] = brief_result.data[0]["brief_text"] if brief_result.data else ""

            # Parse salary_autopilot moves
            if opp.get("type") == "salary_autopilot" and opp.get("extra_data"):
                import json
                try:
                    opp["moves"] = json.loads(opp["extra_data"])
                except Exception:
                    opp["moves"] = []

            opp.pop("user_id", None)

        return {"opportunities": opportunities}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"List error: {str(e)}")


# ── GET /opportunities/:id ────────────────────────────────────

@router.get("/{opportunity_id}")
async def get_opportunity(opportunity_id: str, current_user=Depends(get_current_user)):
    """Get a single opportunity with its brief."""
    try:
        admin = get_supabase_admin()

        opp_result = (
            admin.table("opportunities")
            .select("*")
            .eq("id", opportunity_id)
            .eq("user_id", current_user.id)
            .single()
            .execute()
        )
        if not opp_result.data:
            raise HTTPException(status_code=404, detail="Opportunity not found")

        opp = opp_result.data

        # Get brief
        brief_result = (
            admin.table("action_briefs")
            .select("brief_text, model_used, generated_at")
            .eq("opportunity_id", opp["id"])
            .limit(1)
            .execute()
        )
        opp["brief"] = brief_result.data[0] if brief_result.data else None
        opp.pop("user_id", None)

        return opp

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Get error: {str(e)}")


# ── POST /opportunities/:id/approve ───────────────────────────

@router.post("/{opportunity_id}/approve")
async def approve_opportunity(opportunity_id: str, current_user=Depends(get_current_user)):
    """Approve an opportunity — log to user_actions."""
    try:
        admin = get_supabase_admin()

        # Verify ownership + update status
        opp = (
            admin.table("opportunities")
            .select("id")
            .eq("id", opportunity_id)
            .eq("user_id", current_user.id)
            .eq("status", "pending")
            .single()
            .execute()
        )
        if not opp.data:
            raise HTTPException(status_code=404, detail="Opportunity not found or already actioned")

        admin.table("opportunities").update({"status": "approved"}).eq("id", opportunity_id).execute()

        # Log action
        admin.table("user_actions").insert({
            "opportunity_id": opportunity_id,
            "user_id": current_user.id,
            "decision": "approved",
        }).execute()

        return {"approved": True, "opportunity_id": opportunity_id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Approve error: {str(e)}")


# ── POST /opportunities/:id/skip ──────────────────────────────

@router.post("/{opportunity_id}/skip")
async def skip_opportunity(opportunity_id: str, current_user=Depends(get_current_user)):
    """Skip an opportunity — log to user_actions."""
    try:
        admin = get_supabase_admin()

        opp = (
            admin.table("opportunities")
            .select("id")
            .eq("id", opportunity_id)
            .eq("user_id", current_user.id)
            .eq("status", "pending")
            .single()
            .execute()
        )
        if not opp.data:
            raise HTTPException(status_code=404, detail="Opportunity not found or already actioned")

        admin.table("opportunities").update({"status": "skipped"}).eq("id", opportunity_id).execute()

        admin.table("user_actions").insert({
            "opportunity_id": opportunity_id,
            "user_id": current_user.id,
            "decision": "skipped",
        }).execute()

        return {"skipped": True, "opportunity_id": opportunity_id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skip error: {str(e)}")
