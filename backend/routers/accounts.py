"""
FinishLine Backend — Accounts Router
Plaid integration: link token, exchange, list accounts, sync, disconnect.
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import date, timedelta
from routers.auth import get_current_user
from database import get_supabase_admin
from services.plaid_service import (
    create_link_token,
    exchange_public_token,
    get_plaid_client,
    get_accounts as plaid_get_accounts,
    get_transactions as plaid_get_transactions,
)
from models.schemas import PlaidExchangeRequest

router = APIRouter(prefix="/accounts", tags=["Accounts"])


# ── POST /accounts/plaid/sandbox-token ────────────────────────

@router.post("/plaid/sandbox-token")
async def create_sandbox_token():
    """Generate a Plaid sandbox public_token for demo/testing (no auth required)."""
    try:
        from plaid.model.sandbox_public_token_create_request import SandboxPublicTokenCreateRequest
        from plaid.model.products import Products

        client = get_plaid_client()
        request = SandboxPublicTokenCreateRequest(
            institution_id="ins_109508",
            initial_products=[Products("transactions")]
        )
        response = client.sandbox_public_token_create(request)
        return {"public_token": response.public_token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sandbox token error: {str(e)}")


# ── POST /accounts/plaid/link-token ───────────────────────────

@router.post("/plaid/link-token")
async def create_plaid_link_token(current_user=Depends(get_current_user)):
    """Create a Plaid Link token for the frontend."""
    try:
        link_token = create_link_token(current_user.id)
        return {"link_token": link_token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plaid link token error: {str(e)}")


# ── POST /accounts/plaid/exchange ─────────────────────────────

@router.post("/plaid/exchange")
async def exchange_plaid_token(
    request: PlaidExchangeRequest,
    current_user=Depends(get_current_user),
):
    """Exchange public token for access token, fetch accounts, save to DB."""
    try:
        # 1. Exchange public token for permanent access token
        exchange_result = exchange_public_token(request.public_token)
        access_token = exchange_result["access_token"]
        item_id = exchange_result["item_id"]

        # 2. Fetch accounts from Plaid
        plaid_accounts = plaid_get_accounts(access_token)

        # 3. Save each account to connected_accounts (admin bypasses RLS)
        admin = get_supabase_admin()
        saved_accounts = []

        for acct in plaid_accounts:
            account_data = {
                "user_id": current_user.id,
                "plaid_item_id": str(item_id),
                "plaid_access_token": str(access_token),  # NEVER sent to frontend
                "institution_name": request.institution_name,
                "account_type": str(acct.subtype) if acct.subtype else str(acct.type) if acct.type else "checking",
                "plaid_account_id": str(acct.account_id),
                "balance": float(acct.balances.current) if acct.balances.current is not None else 0.0,
            }
            result = admin.table("connected_accounts").insert(account_data).execute()
            if result.data:
                saved = result.data[0]
                # Strip access token before adding to response
                saved.pop("plaid_access_token", None)
                saved_accounts.append(saved)

        return {"accounts": saved_accounts, "count": len(saved_accounts)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plaid exchange error: {str(e)}")


# ── GET /accounts ─────────────────────────────────────────────

@router.get("")
async def list_accounts(current_user=Depends(get_current_user)):
    """List all connected accounts for the current user."""
    try:
        admin = get_supabase_admin()
        result = (
            admin.table("connected_accounts")
            .select("id, institution_name, account_type, plaid_account_id, balance, last_synced, created_at")
            .eq("user_id", current_user.id)
            .execute()
        )
        return {"accounts": result.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Accounts list error: {str(e)}")


# ── POST /accounts/:id/sync ──────────────────────────────────

@router.post("/{account_id}/sync")
async def sync_account(account_id: str, current_user=Depends(get_current_user)):
    """Force sync balance + transactions from Plaid for a specific account."""
    try:
        admin = get_supabase_admin()

        # 1. Get the account (verify ownership + get access token)
        acct_result = (
            admin.table("connected_accounts")
            .select("*")
            .eq("id", account_id)
            .eq("user_id", current_user.id)
            .single()
            .execute()
        )
        if not acct_result.data:
            raise HTTPException(status_code=404, detail="Account not found")

        account = acct_result.data
        access_token = account["plaid_access_token"]
        plaid_account_id = account["plaid_account_id"]

        # 2. Fetch fresh balance from Plaid
        plaid_accounts = plaid_get_accounts(access_token)
        for pa in plaid_accounts:
            if pa.account_id == plaid_account_id:
                new_balance = float(pa.balances.current or 0)
                admin.table("connected_accounts").update({
                    "balance": new_balance,
                    "last_synced": "now()",
                }).eq("id", account_id).execute()
                break

        # 3. Fetch last 90 days of transactions
        end_date = date.today()
        start_date = end_date - timedelta(days=90)
        plaid_txns = plaid_get_transactions(access_token, start_date, end_date)

        # 4. Insert transactions (skip duplicates by checking existing)
        transaction_count = 0
        for txn in plaid_txns:
            # Only save transactions for this specific account
            if txn.account_id != plaid_account_id:
                continue

            # Detect salary: large positive amount > $1000
            is_salary = float(txn.amount) < -1000  # Plaid: negative = income

            txn_data = {
                "account_id": account_id,
                "user_id": current_user.id,
                "amount": float(txn.amount),
                "date": str(txn.date),
                "category": txn.category[0] if txn.category else "",
                "merchant_name": txn.merchant_name or txn.name or "",
                "is_salary": is_salary,
            }
            admin.table("transactions").insert(txn_data).execute()
            transaction_count += 1

        return {"synced": True, "transaction_count": transaction_count}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync error: {str(e)}")


# ── DELETE /accounts/:id ──────────────────────────────────────

@router.delete("/{account_id}")
async def disconnect_account(account_id: str, current_user=Depends(get_current_user)):
    """Disconnect a bank account — delete from DB."""
    try:
        admin = get_supabase_admin()

        # Verify ownership
        acct = (
            admin.table("connected_accounts")
            .select("id")
            .eq("id", account_id)
            .eq("user_id", current_user.id)
            .single()
            .execute()
        )
        if not acct.data:
            raise HTTPException(status_code=404, detail="Account not found")

        # Delete (cascade will remove transactions)
        admin.table("connected_accounts").delete().eq("id", account_id).execute()

        return {"deleted": True}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete error: {str(e)}")
