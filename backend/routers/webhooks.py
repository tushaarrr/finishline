"""
FinishLine Backend — Webhooks Router
Receives Plaid transaction webhooks.
"""
from fastapi import APIRouter, HTTPException, Request
from database import get_supabase_admin

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


# ── POST /webhooks/plaid ──────────────────────────────────────

@router.post("/plaid")
async def plaid_webhook(request: Request):
    """
    Receive Plaid transaction webhooks.
    When new transactions are detected, trigger a sync for the affected user.
    """
    try:
        body = await request.json()
        webhook_type = body.get("webhook_type", "")
        webhook_code = body.get("webhook_code", "")
        item_id = body.get("item_id", "")

        # Log the webhook
        print(f"Plaid webhook: type={webhook_type}, code={webhook_code}, item={item_id}")

        # Only handle transaction webhooks for now
        if webhook_type != "TRANSACTIONS":
            return {"received": True, "action": "ignored"}

        if webhook_code in ("INITIAL_UPDATE", "DEFAULT_UPDATE"):
            # Find the user who owns this Plaid item
            admin = get_supabase_admin()
            account_result = (
                admin.table("connected_accounts")
                .select("user_id, id")
                .eq("plaid_item_id", item_id)
                .limit(1)
                .execute()
            )

            if account_result.data:
                # Log that we received a webhook — actual sync handled by frontend
                # requesting POST /accounts/:id/sync
                return {
                    "received": True,
                    "action": "transaction_update_detected",
                    "user_id": account_result.data[0]["user_id"],
                }

        return {"received": True, "action": "no_action_taken"}

    except Exception as e:
        print(f"Webhook error: {e}")
        return {"received": True, "error": str(e)}
