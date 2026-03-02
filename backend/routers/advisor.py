"""
FinishLine Backend — Advisor Router
Internal advisor copilot: view flagged clients, send alerts, view detail.
All endpoints require role='advisor' — regular users get 403.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import date, datetime, timedelta
from routers.auth import get_current_user
from database import get_supabase_admin

router = APIRouter(prefix="/advisor", tags=["Advisor"])


# ── Pydantic Models ───────────────────────────────────────────

class AlertRequest(BaseModel):
    message: str


# ── GET /advisor/my-alerts (for regular users) ───────────────

@router.get("/my-alerts")
async def get_my_alerts(current_user=Depends(get_current_user)):
    """Return alerts sent TO this user by any advisor. For consumer dashboard notifications."""
    try:
        admin = get_supabase_admin()
        alerts_result = (
            admin.table("advisor_alerts")
            .select("*")
            .eq("client_user_id", current_user.id)
            .order("sent_at", desc=True)
            .limit(20)
            .execute()
        )
        return {"alerts": alerts_result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fetch alerts error: {str(e)}")


# ── Helper: Verify Advisor Role ───────────────────────────────

async def verify_advisor(current_user=Depends(get_current_user)):
    """Check that the calling user has role='advisor' in the users table."""
    admin = get_supabase_admin()
    result = admin.table("users").select("role").eq("id", current_user.id).single().execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    if result.data.get("role") != "advisor":
        raise HTTPException(status_code=403, detail="Access denied — advisor role required")

    return current_user


# ── GET /advisor/clients ──────────────────────────────────────

@router.get("/clients")
async def list_clients(advisor=Depends(verify_advisor)):
    """
    Get all users with connected accounts, enriched with their latest
    pending opportunity and brief. Sorted by risk: urgent > high > ok.
    """
    try:
        admin = get_supabase_admin()

        # 1. Get all regular users
        users_result = admin.table("users").select("*").eq("role", "user").execute()
        all_users = users_result.data or []

        # 2. Get users with at least 1 connected account
        accts_result = admin.table("connected_accounts").select("user_id").execute()
        user_ids_with_accounts = set(a["user_id"] for a in (accts_result.data or []))

        clients = []
        for user in all_users:
            uid = user["id"]
            if uid not in user_ids_with_accounts:
                continue

            # Get latest pending opportunity
            opp_result = (
                admin.table("opportunities")
                .select("*")
                .eq("user_id", uid)
                .eq("status", "pending")
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            latest_opp = opp_result.data[0] if opp_result.data else None

            # Get brief for that opportunity
            brief_text = ""
            if latest_opp:
                brief_result = (
                    admin.table("action_briefs")
                    .select("brief_text")
                    .eq("opportunity_id", latest_opp["id"])
                    .limit(1)
                    .execute()
                )
                brief_text = brief_result.data[0]["brief_text"] if brief_result.data else ""

            # Determine risk level
            priority = latest_opp.get("priority", "") if latest_opp else ""
            if priority == "urgent":
                risk_level = "urgent"
            elif priority == "high":
                risk_level = "high"
            else:
                risk_level = "ok"

            # Get account count
            user_accts = admin.table("connected_accounts").select("id, institution_name, balance, account_type").eq("user_id", uid).execute()

            client_data = {
                "user_id": uid,
                "full_name": user.get("full_name") or "Unknown",
                "email": user.get("email") or "",
                "country": user.get("country") or "",
                "risk_level": risk_level,
                "accounts_count": len(user_accts.data or []),
                "accounts": user_accts.data[:3] if user_accts.data else [],  # top 3 for preview
                "opportunity": None,
            }

            if latest_opp:
                latest_opp.pop("user_id", None)
                client_data["opportunity"] = {
                    "id": latest_opp["id"],
                    "type": latest_opp.get("type", ""),
                    "title": latest_opp.get("title", ""),
                    "priority": latest_opp.get("priority", ""),
                    "amount": latest_opp.get("amount", 0),
                    "impact_value": latest_opp.get("impact_value", 0),
                    "impact_text": latest_opp.get("impact_text", ""),
                    "brief_text": brief_text,
                }

            clients.append(client_data)

        # Sort: urgent first, high second, ok last
        sort_order = {"urgent": 0, "high": 1, "ok": 2}
        clients.sort(key=lambda c: sort_order.get(c["risk_level"], 2))

        urgent = [c for c in clients if c["risk_level"] == "urgent"]
        high = [c for c in clients if c["risk_level"] == "high"]
        ok_count = len([c for c in clients if c["risk_level"] == "ok"])

        return {
            "clients": clients,
            "urgent_count": len(urgent),
            "high_count": len(high),
            "ok_count": ok_count,
            "total": len(clients),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"List clients error: {str(e)}")

# ── GET /advisor/clients/health ───────────────────────────────

def calculate_health_score(user, accounts, transactions, actions):
    score = 0
    breakdown = {}

    # 1. Emergency fund
    recent_transactions = [t for t in transactions if t.get("date") and (date.today() - datetime.strptime(t["date"], "%Y-%m-%d").date()).days <= 90]
    avg_spend = sum(t.get("amount", 0) for t in recent_transactions if t.get("amount", 0) > 0) / 3
    savings = sum(a.get("balance", 0) for a in accounts if 'saving' in a.get("account_type", "").lower())
    ef = min(20, int((savings / max(avg_spend * 3, 1)) * 20))
    breakdown['emergency_fund'] = { 'score': ef, 'max': 20,
      'reason': f'${savings:.0f} saved vs ${(avg_spend * 3):.0f} target' }

    # 2. No high-interest debt
    cc_transactions = [t for t in transactions if t.get("date") and (date.today() - datetime.strptime(t["date"], "%Y-%m-%d").date()).days <= 30]
    has_cc = any('credit' in (t.get("category") or '').lower() for t in cc_transactions)
    debt = 0 if has_cc else 20
    breakdown['no_debt'] = { 'score': debt, 'max': 20,
      'reason': 'Credit card spending detected' if has_cc else 'No CC debt' }

    # 3. Active investing
    investing = 20 if actions else 0
    breakdown['investing'] = { 'score': investing, 'max': 20,
      'reason': f'{len(actions)} opportunities approved' }

    # 4. Spending discipline
    monthly_spend = sum(t.get("amount", 0) for t in cc_transactions if t.get("amount", 0) > 0)
    monthly_income = user.get("monthly_income", 5000) or 5000  # Fallback to 5000 if not present
    ratio = monthly_spend / max(monthly_income, 1)
    spend = 20 if ratio < 0.8 else max(0, int(20 - (ratio - 0.8) * 100))
    breakdown['spending'] = { 'score': spend, 'max': 20,
      'reason': f'Spending {(ratio * 100):.0f}% of income' }

    # 5. Salary consistency
    cutoff = date.today() - timedelta(days=90)
    salary_months = set()
    for t in transactions:
        amount = t.get("amount", 0)
        # Transactions with negative amounts in Plaid are typically incoming (like salary)
        # We also want to check the date.
        if amount < 0 and t.get("date"):
            t_date = datetime.strptime(t["date"], "%Y-%m-%d").date()
            if t_date >= cutoff:
                salary_months.add(t_date.month)
    
    months = len(salary_months)
    sal = min(20, months * 7)
    breakdown['salary'] = { 'score': sal, 'max': 20,
      'reason': f'Salary detected in {months}/3 months' }

    total = ef + debt + investing + spend + sal
    tier = 'critical' if total < 50 else 'at_risk' if total < 80 else 'healthy'
    return { 'total': total, 'tier': tier, 'breakdown': breakdown }

@router.get("/clients/health")
async def get_health_scores(advisor=Depends(verify_advisor)):
    """Get health scores for all regular clients, sorted worst first."""
    try:
        admin = get_supabase_admin()
        
        # 1. Get all regular users
        users_result = admin.table("users").select("*").eq("role", "user").execute()
        users = users_result.data or []
        
        # 2. Get all required data for calculation
        if not users:
             return {"clients": [], "critical": 0, "at_risk": 0, "healthy": 0}
             
        user_ids = [u["id"] for u in users]
        
        accts_result = admin.table("connected_accounts").select("user_id, account_type, balance").in_("user_id", user_ids).execute()
        accounts_by_user = {}
        for a in accts_result.data or []:
            accounts_by_user.setdefault(a["user_id"], []).append(a)
            
        txn_result = admin.table("transactions").select("user_id, date, amount, category").in_("user_id", user_ids).order("date", desc=True).limit(2000).execute()
        txns_by_user = {}
        for t in txn_result.data or []:
             txns_by_user.setdefault(t["user_id"], []).append(t)
             
        actions_result = admin.table("user_actions").select("user_id").eq("decision", "approved").in_("user_id", user_ids).execute()
        actions_by_user = {}
        for a in actions_result.data or []:
             actions_by_user.setdefault(a["user_id"], []).append(a)
             
        clients = []
        for user in users:
             uid = user["id"]
             accts = accounts_by_user.get(uid, [])
             if not accts:
                 continue # Skip users with no accounts
                 
             txns = txns_by_user.get(uid, [])
             actions = actions_by_user.get(uid, [])
             
             health = calculate_health_score(user, accts, txns, actions)
             
             clients.append({
                 "user_id": uid,
                 "full_name": user.get("full_name") or "Unknown",
                 "email": user.get("email") or "",
                 "total": health["total"],
                 "tier": health["tier"],
                 "breakdown": health["breakdown"]
             })
             
        # Sort worst first
        clients.sort(key=lambda x: x["total"])
        
        return {
            "clients": clients,
            "critical_count": sum(1 for c in clients if c["tier"] == "critical"),
            "at_risk_count": sum(1 for c in clients if c["tier"] == "at_risk"),
            "healthy_count": sum(1 for c in clients if c["tier"] == "healthy")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health calculation error: {str(e)}")

@router.get("/clients/{user_id}/health-breakdown")
async def get_client_health_breakdown(user_id: str, advisor=Depends(verify_advisor)):
    """Get the full health score breakdown for a single client."""
    try:
        admin = get_supabase_admin()
        
        user_result = admin.table("users").select("*").eq("id", user_id).single().execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="Client not found")
        user = user_result.data
        
        accts_result = admin.table("connected_accounts").select("account_type, balance").eq("user_id", user_id).execute()
        txn_result = admin.table("transactions").select("date, amount, category").eq("user_id", user_id).order("date", desc=True).limit(200).execute()
        actions_result = admin.table("user_actions").select("id").eq("user_id", user_id).eq("decision", "approved").execute()
        
        health = calculate_health_score(
            user, 
            accts_result.data or [], 
            txn_result.data or [], 
            actions_result.data or []
        )
        
        return {
            "user_id": user_id,
            "full_name": user.get("full_name") or "Unknown",
            "total": health["total"],
            "tier": health["tier"],
            "breakdown": health["breakdown"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Breakdown error: {str(e)}")

# ── GET /advisor/clients/dormant ──────────────────────────────

@router.get("/clients/dormant")
async def get_dormant_clients(advisor=Depends(verify_advisor)):
    """Identify inactive clients with pending opportunities and generate AI messages."""
    try:
        admin = get_supabase_admin()
        
        # 1. Get all regular users
        users_result = admin.table("users").select("*").eq("role", "user").execute()
        users = users_result.data or []
        
        if not users:
             return {"clients": [], "total_dormant": 0}
             
        user_ids = [u["id"] for u in users]
        
        # 2. Get last action
        actions_result = admin.table("user_actions").select("user_id, decided_at").in_("user_id", user_ids).execute()
        last_action_by_user = {}
        for action in actions_result.data or []:
             uid = action["user_id"]
             d_str = action.get("decided_at")
             if d_str:
                 d = datetime.fromisoformat(d_str.replace("Z", "+00:00")).date()
                 if uid not in last_action_by_user or d > last_action_by_user[uid]:
                     last_action_by_user[uid] = d
                     
        # 3. Get connected account balances
        accts_result = admin.table("connected_accounts").select("user_id, balance").in_("user_id", user_ids).execute()
        balance_by_user = {}
        for a in accts_result.data or []:
             uid = a["user_id"]
             balance_by_user[uid] = balance_by_user.get(uid, 0) + float(a.get("balance", 0) or 0)
             
        # 4. Get pending opportunities
        opps_result = admin.table("opportunities").select("*").eq("status", "pending").in_("user_id", user_ids).execute()
        opps_by_user = {}
        for opp in opps_result.data or []:
             opps_by_user.setdefault(opp["user_id"], []).append(opp)
             
        clients = []
        for user in users:
             uid = user["id"]
             balance = balance_by_user.get(uid, 0)
             opps = opps_by_user.get(uid, [])
             
             if balance < 1000 or not opps:
                 continue
                 
             last_action_date = last_action_by_user.get(uid)
             if last_action_date:
                 days_inactive = (date.today() - last_action_date).days
             else:
                 days_inactive = 999
                 
             if days_inactive < 60:
                 continue
                 
             # Generate AI Message
             # Sort opps by priority mapping urgent -> 0
             sort_map = {"urgent": 0, "high": 1, "medium": 2, "low": 3}
             opps.sort(key=lambda o: sort_map.get(o.get("priority", "medium"), 2))
             top_opp = opps[0]
             
             name = user.get("full_name", "").split(" ")[0] if user.get("full_name") else "there"
             opp_type = top_opp.get("type", "")
             opp_amount = top_opp.get("amount", 0)
             impact = top_opp.get("impact_value", 0)
             
             msg = ""
             if opp_type == "rrsp_deadline":
                 tax_bracket = user.get("tax_bracket", 0.3)
                 saved = round(opp_amount * tax_bracket)
                 # Approximating days to March 1st
                 year = date.today().year if date.today().month < 3 else date.today().year + 1
                 days_to_march = max((date(year, 3, 1) - date.today()).days, 0)
                 msg = f"Hi {name}, your RRSP deadline is {days_to_march} days away. A ${opp_amount:,.0f} contribution saves ${saved:,.0f} in taxes. Takes 2 mins."
             elif opp_type == "idle_cash":
                 msg = f"Hi {name}, ${opp_amount:,.0f} is sitting idle earning nothing. Moving it to your TFSA earns ${impact:,.0f} more this year."
             elif opp_type == "tfsa_room":
                 msg = f"Hi {name}, you have unused TFSA room that could be growing tax-free right now. Takes 2 minutes."
             else:
                 msg = f"Hi {name}, your AI has {len(opps)} recommendations waiting. Worth checking — takes 2 minutes."
                 
             clients.append({
                 "user_id": uid,
                 "full_name": user.get("full_name") or "Unknown",
                 "email": user.get("email") or "",
                 "days_inactive": days_inactive,
                 "total_balance": balance,
                 "pending_count": len(opps),
                 "top_opp": {
                     "type": opp_type,
                     "amount": opp_amount,
                     "impact_value": impact
                 },
                 "ai_message": msg
             })
             
        # Sort by days inactive
        clients.sort(key=lambda x: x["days_inactive"], reverse=True)
        
        return {
            "clients": clients,
            "total_dormant": len(clients)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dormant api error: {str(e)}")


# ── GET /advisor/clients/engagement ───────────────────────────

@router.get("/clients/engagement")
async def get_engagement_analytics(advisor=Depends(verify_advisor)):
    """Calculate opportunity approval rates and tiers for all clients."""
    try:
        admin = get_supabase_admin()
        
        users_result = admin.table("users").select("*").eq("role", "user").execute()
        users = users_result.data or []
        
        if not users:
             return {"clients": [], "summary": {}}
             
        user_ids = [u["id"] for u in users]
        
        accts_result = admin.table("connected_accounts").select("user_id").in_("user_id", user_ids).execute()
        user_ids_with_accts = set(a["user_id"] for a in (accts_result.data or []))
        
        opps_result = admin.table("opportunities").select("id, user_id, status, impact_value, title").in_("user_id", user_ids).execute()
        actions_result = admin.table("user_actions").select("user_id, decision, opportunity_id, decided_at").in_("user_id", user_ids).execute()
        
        opps_by_user = {}
        for o in opps_result.data or []:
            opps_by_user.setdefault(o["user_id"], []).append(o)
            
        actions_by_user = {}
        for a in actions_result.data or []:
            actions_by_user.setdefault(a["user_id"], []).append(a)
            
        clients = []
        for user in users:
            uid = user["id"]
            if uid not in user_ids_with_accts:
                continue
                
            opps = opps_by_user.get(uid, [])
            actions = actions_by_user.get(uid, [])
            
            total_opps = len(opps)
            approved = sum(1 for a in actions if a["decision"] == "approved")
            skipped = sum(1 for a in actions if a["decision"] == "skipped")
            
            rate = round((approved / total_opps) * 100) if total_opps > 0 else 0
            
            missed_val = sum(o.get("impact_value", 0) for o in opps if o["status"] == "skipped")
            
            skipped_actions = [a for a in actions if a["decision"] == "skipped"]
            last_skipped_title = ""
            last_skipped_days = 0
            
            if skipped_actions:
                skipped_actions.sort(key=lambda x: x.get("decided_at", ""), reverse=True)
                last = skipped_actions[0]
                opp_match = next((o for o in opps if o["id"] == last.get("opportunity_id")), None)
                if opp_match:
                    last_skipped_title = opp_match.get("title", "")
                
                d_str = last.get("decided_at")
                if d_str:
                    d = datetime.fromisoformat(d_str.replace("Z", "+00:00")).date()
                    last_skipped_days = (date.today() - d).days
                    
            if approved == 0:
                tier = "zero"
            elif rate < 30:
                tier = "low"
            elif rate < 60:
                tier = "medium"
            else:
                tier = "high"
                
            clients.append({
                "user_id": uid,
                "full_name": user.get("full_name") or "Unknown",
                "email": user.get("email") or "",
                "total_opps": total_opps,
                "approved": approved,
                "skipped": skipped,
                "rate": rate,
                "tier": tier,
                "missed_val": missed_val,
                "last_skipped_title": last_skipped_title,
                "last_skipped_days": last_skipped_days
            })
            
        sort_map = {"zero": 0, "low": 1, "medium": 2, "high": 3}
        clients.sort(key=lambda c: (sort_map.get(c["tier"], 3), c["rate"]))
        
        summary = {
            "champion": sum(1 for c in clients if c["tier"] == "high"),
            "engaged": sum(1 for c in clients if c["tier"] == "medium"),
            "disengaged": sum(1 for c in clients if c["tier"] == "low"),
            "zero": sum(1 for c in clients if c["tier"] == "zero")
        }
        
        return {
            "clients": clients,
            "summary": summary
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Engagement analytics error: {str(e)}")



# ── POST /advisor/clients/{user_id}/alert ─────────────────────

@router.post("/clients/{user_id}/alert")
async def send_alert(user_id: str, request: AlertRequest, advisor=Depends(verify_advisor)):
    """Send an alert/message to a client. Saved to advisor_alerts table."""
    try:
        admin = get_supabase_admin()

        # Verify target user exists and is a regular user
        target = admin.table("users").select("id, role").eq("id", user_id).single().execute()
        if not target.data:
            raise HTTPException(status_code=404, detail="Client not found")
        if target.data.get("role") != "user":
            raise HTTPException(status_code=400, detail="Can only send alerts to regular users")

        # Insert alert
        alert_result = admin.table("advisor_alerts").insert({
            "advisor_id": advisor.id,
            "client_user_id": user_id,
            "message": request.message,
        }).execute()

        if not alert_result.data:
            raise HTTPException(status_code=500, detail="Failed to insert alert")

        alert = alert_result.data[0]

        return {
            "sent": True,
            "alert_id": alert["id"],
            "sent_at": alert.get("sent_at") or alert.get("created_at", ""),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Send alert error: {str(e)}")


# ── GET /advisor/clients/{user_id}/detail ─────────────────────

@router.get("/clients/{user_id}/detail")
async def get_client_detail(user_id: str, advisor=Depends(verify_advisor)):
    """Get full detail for a single client: profile, accounts, transactions, opportunities, past alerts."""
    try:
        admin = get_supabase_admin()

        # 1. User profile
        user_result = admin.table("users").select("*").eq("id", user_id).single().execute()
        if not user_result.data:
            raise HTTPException(status_code=404, detail="Client not found")

        profile = user_result.data
        profile.pop("id", None)  # Don't expose internal ID format unneeded

        # 2. Connected accounts (strip plaid_access_token)
        accts_result = (
            admin.table("connected_accounts")
            .select("id, institution_name, account_type, balance, last_synced")
            .eq("user_id", user_id)
            .execute()
        )

        # 3. Last 20 transactions
        txn_result = (
            admin.table("transactions")
            .select("id, date, merchant_name, amount, category")
            .eq("user_id", user_id)
            .order("date", desc=True)
            .limit(20)
            .execute()
        )

        # 4. All pending opportunities with briefs
        opps_result = (
            admin.table("opportunities")
            .select("*")
            .eq("user_id", user_id)
            .eq("status", "pending")
            .order("created_at", desc=True)
            .execute()
        )
        opportunities = opps_result.data or []

        for opp in opportunities:
            brief_result = (
                admin.table("action_briefs")
                .select("brief_text")
                .eq("opportunity_id", opp["id"])
                .limit(1)
                .execute()
            )
            opp["brief_text"] = brief_result.data[0]["brief_text"] if brief_result.data else ""
            opp.pop("user_id", None)

        # 5. Past advisor alerts for this client
        alerts_result = (
            admin.table("advisor_alerts")
            .select("*")
            .eq("client_user_id", user_id)
            .order("sent_at", desc=True)
            .limit(10)
            .execute()
        )

        return {
            "profile": profile,
            "accounts": accts_result.data or [],
            "transactions": txn_result.data or [],
            "opportunities": opportunities,
            "alerts": alerts_result.data or [],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Client detail error: {str(e)}")
