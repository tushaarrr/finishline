"""
FinishLine Backend — Chat Router
AI chatbot with RAG, stock quotes, escalation, and agent execution.
"""
import re, json, httpx
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from routers.auth import get_current_user
from database import get_supabase_admin
from config import get_settings

router = APIRouter(prefix="/chat", tags=["Chat"])


# ── Pydantic Models ───────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str

class ExecuteRequest(BaseModel):
    action_type: str
    amount: float
    from_account_id: str
    to_account: str


# ── Constants ─────────────────────────────────────────────────

ESCALATION_KEYWORDS = ['human', 'advisor', 'person', 'call me', 'real person', 'speak with', 'real advisor', 'talk to someone']
STOCK_KEYWORDS = ['buy', 'invest in', 'should i get', 'what about', 'stock', 'ticker', 'shares']


# ── Helpers ───────────────────────────────────────────────────

def _check_escalation(message: str) -> bool:
    msg = message.lower()
    return any(kw in msg for kw in ESCALATION_KEYWORDS)


def _extract_stock_ticker(message: str) -> str | None:
    tickers = re.findall(r'\b[A-Z]{2,5}\b', message)
    noise = {'TFSA', 'RRSP', 'GIC', 'HISA', 'ETF', 'USD', 'CAD', 'THE', 'AND', 'FOR', 'NOT', 'YOU', 'CAN', 'HOW', 'WHAT', 'SHOULD'}
    tickers = [t for t in tickers if t not in noise]
    return tickers[0] if tickers else None


def _has_stock_intent(message: str) -> bool:
    msg = message.lower()
    return any(kw in msg for kw in STOCK_KEYWORDS)


async def _fetch_stock_data(ticker: str) -> dict | None:
    settings = get_settings()
    if not settings.alpha_vantage_api_key:
        return None
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                "https://www.alphavantage.co/query",
                params={"function": "GLOBAL_QUOTE", "symbol": ticker, "apikey": settings.alpha_vantage_api_key}
            )
            data = resp.json().get("Global Quote", {})
            if not data:
                return None
            return {
                "ticker": ticker,
                "price": data.get("05. price", "N/A"),
                "change": data.get("09. change", "N/A"),
                "change_pct": data.get("10. change percent", "N/A"),
            }
    except Exception:
        return None


def _extract_intent(message: str, accounts: list) -> dict | None:
    """Check if this is a financial action command using pattern matching."""
    msg = message.lower()
    action_patterns = [
        (r'move\s+\$?([\d,]+)', 'transfer'),
        (r'transfer\s+\$?([\d,]+)', 'transfer'),
        (r'invest\s+\$?([\d,]+)', 'invest'),
        (r'contribute\s+\$?([\d,]+)', 'rrsp'),
        (r'pay.*(?:credit|card|debt).*\$?([\d,]+)', 'pay_debt'),
        (r'put\s+\$?([\d,]+)', 'transfer'),
    ]

    amount = None
    action_type = None
    for pattern, atype in action_patterns:
        match = re.search(pattern, msg)
        if match:
            amount = float(match.group(1).replace(',', ''))
            action_type = atype
            break

    if not amount or not action_type:
        return None

    # Detect destination
    to_account = 'TFSA'  # default
    if 'rrsp' in msg:
        to_account = 'RRSP'
        action_type = 'rrsp'
    elif 'tfsa' in msg:
        to_account = 'TFSA'
        action_type = 'tfsa'
    elif 'credit' in msg or 'card' in msg or 'debt' in msg:
        to_account = 'Credit Card'
        action_type = 'pay_debt'

    # Find source (chequing) account
    chequing = None
    for acc in accounts:
        if acc.get('account_type') in ('checking', 'chequing', 'depository'):
            chequing = acc
            break
    if not chequing and accounts:
        chequing = accounts[0]

    if not chequing:
        return None

    # Validate balance
    if chequing.get('balance', 0) < amount:
        return {
            'is_action': True,
            'valid': False,
            'error': f"You don't have enough balance. Your {chequing.get('institution_name', 'account')} has ${chequing.get('balance', 0):,.2f}."
        }

    total_balance = sum(a.get('balance', 0) for a in accounts)
    if amount > total_balance * 0.4:
        return {
            'is_action': True,
            'valid': False,
            'error': f"That's more than 40% of your total balance (${total_balance:,.2f}). Try a smaller amount."
        }

    # Build impact text
    impact = ""
    if action_type in ('tfsa',):
        impact = f" Earns ${amount * 0.05:,.0f}/yr tax-free."
    elif action_type in ('rrsp',):
        impact = f" Saves ${amount * 0.33:,.0f} in taxes at 33%."
    elif action_type == 'pay_debt':
        impact = f" Saves ${amount * 0.02:,.0f}/month in interest."

    return {
        'is_action': True,
        'valid': True,
        'action_type': action_type,
        'amount': amount,
        'from_account': chequing.get('institution_name', 'Chequing'),
        'from_account_id': chequing.get('id'),
        'to_account': to_account,
        'confirmation_text': f"Move ${amount:,.0f} from {chequing.get('institution_name', 'Chequing')} to {to_account}?{impact}",
    }


# ── POST /chat ────────────────────────────────────────────────

@router.post("")
async def chat(request: ChatRequest, current_user=Depends(get_current_user)):
    """Main chat endpoint — escalation → intent → stock → RAG → Claude."""
    try:
        import anthropic
        settings = get_settings()
        admin = get_supabase_admin()
        message = request.message.strip()

        # 1. Escalation check
        if _check_escalation(message):
            user_result = admin.table("users").select("email").eq("id", current_user.id).single().execute()
            email = user_result.data.get("email", "") if user_result.data else ""

            # Save to advisor_alerts
            try:
                admin.table("advisor_alerts").insert({
                    "advisor_id": current_user.id,
                    "client_user_id": current_user.id,
                    "message": f"Client requested human advisor. Original message: {message}",
                }).execute()
            except Exception:
                pass

            response_text = f"A FinishLine advisor will reach out to you at {email} within 24 hours. Is there anything specific you'd like them to know?"

            # Save messages
            admin.table("chat_messages").insert({"user_id": current_user.id, "role": "user", "content": message}).execute()
            admin.table("chat_messages").insert({"user_id": current_user.id, "role": "assistant", "content": response_text}).execute()

            return {"response": response_text, "escalated": True}

        # 2. Fetch user context
        user_result = admin.table("users").select("*").eq("id", current_user.id).single().execute()
        user_profile = user_result.data or {}

        accounts_result = admin.table("connected_accounts").select("*").eq("user_id", current_user.id).execute()
        accounts = accounts_result.data or []

        # 3. Intent extraction (agent commands)
        intent = _extract_intent(message, accounts)
        if intent and intent.get('is_action'):
            if not intent.get('valid'):
                error_resp = intent.get('error', "Can't process that right now.")
                admin.table("chat_messages").insert({"user_id": current_user.id, "role": "user", "content": message}).execute()
                admin.table("chat_messages").insert({"user_id": current_user.id, "role": "assistant", "content": error_resp}).execute()
                return {"response": error_resp}

            admin.table("chat_messages").insert({"user_id": current_user.id, "role": "user", "content": message}).execute()
            return {
                "response": intent['confirmation_text'],
                "is_action": True,
                "pending_action": {
                    "action_type": intent['action_type'],
                    "amount": intent['amount'],
                    "from_account": intent['from_account'],
                    "from_account_id": intent['from_account_id'],
                    "to_account": intent['to_account'],
                }
            }

        # 4. Stock data
        stock_context = ""
        if _has_stock_intent(message):
            ticker = _extract_stock_ticker(message)
            if ticker:
                stock_data = await _fetch_stock_data(ticker)
                if stock_data:
                    stock_context = f"\nStock data for {stock_data['ticker']}: Price ${stock_data['price']}, Change {stock_data['change']} ({stock_data['change_pct']})"

        # 5. RAG context
        rag_context = ""
        try:
            from services.rag_service import get_relevant_context as get_rag
            rag_context = get_rag("general_finance", user_profile.get("country", "CA"))
        except Exception:
            pass

        # 6. Opportunities context
        opps_result = admin.table("opportunities").select("type, title, amount, impact_text").eq("user_id", current_user.id).eq("status", "pending").limit(3).execute()
        opps_summary = "\n".join([f"- {o['title']} (${o.get('amount', 0):,.0f})" for o in (opps_result.data or [])])

        # 7. Accounts summary
        accts_summary = "\n".join([f"- {a.get('institution_name', 'Account')} ({a.get('account_type', '')}): ${a.get('balance', 0):,.2f}" for a in accounts])

        # 8. Chat history
        history_result = admin.table("chat_messages").select("role, content").eq("user_id", current_user.id).order("created_at", desc=True).limit(10).execute()
        history = list(reversed(history_result.data or []))

        # 9. System prompt
        system_prompt = f"""You are FinishLine, AI personal CFO for {user_profile.get('full_name', 'the user')}.
Country: {user_profile.get('country', 'CA')} | Tax bracket: {user_profile.get('tax_bracket', 0.30) * 100:.0f}% | Income: ${user_profile.get('monthly_income', 0):,.0f}/mo

Accounts:
{accts_summary or 'No accounts connected yet'}

Pending opportunities:
{opps_summary or 'None right now'}

{rag_context or ''}
{stock_context}

STRICT RULES — follow exactly:
- MAXIMUM 2 sentences, under 40 words total
- Use exact $ amounts from their data
- Never say 'I recommend' — say 'based on your data'
- Stock questions: end with 'Not financial advice.'
- Tone: casual, direct, like a smart friend texting
- NO greetings, NO filler, NO disclaimers beyond what's required
- Get straight to the point"""

        # 10. Call Claude
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        messages = [{"role": m["role"], "content": m["content"]} for m in history]
        messages.append({"role": "user", "content": message})

        claude_response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=100,
            system=system_prompt,
            messages=messages,
        )
        response_text = claude_response.content[0].text

        # 11. Save messages
        admin.table("chat_messages").insert({"user_id": current_user.id, "role": "user", "content": message}).execute()
        admin.table("chat_messages").insert({"user_id": current_user.id, "role": "assistant", "content": response_text}).execute()

        return {"response": response_text, "escalated": False}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


# ── GET /chat/history ─────────────────────────────────────────

@router.get("/history")
async def chat_history(current_user=Depends(get_current_user)):
    """Return last 20 messages for chat persistence."""
    try:
        admin = get_supabase_admin()
        result = (
            admin.table("chat_messages")
            .select("role, content, created_at")
            .eq("user_id", current_user.id)
            .order("created_at", desc=True)
            .limit(20)
            .execute()
        )
        messages = list(reversed(result.data or []))
        return {"messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"History error: {str(e)}")


# ── POST /chat/execute ────────────────────────────────────────

@router.post("/execute")
async def execute_action(request: ExecuteRequest, current_user=Depends(get_current_user)):
    """Execute a confirmed financial action (simulated)."""
    try:
        admin = get_supabase_admin()

        # 1. Verify account ownership
        acc_result = (
            admin.table("connected_accounts")
            .select("*")
            .eq("id", request.from_account_id)
            .eq("user_id", current_user.id)
            .single()
            .execute()
        )
        if not acc_result.data:
            raise HTTPException(status_code=404, detail="Account not found")

        account = acc_result.data
        if account.get("balance", 0) < request.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")

        # 2. Log execution
        admin.table("agent_executions").insert({
            "user_id": current_user.id,
            "action_type": request.action_type,
            "amount": request.amount,
            "from_account": account.get("institution_name", ""),
            "to_account": request.to_account,
            "status": "simulated",
        }).execute()

        # 3. Update balance (simulate)
        new_balance = round(account["balance"] - request.amount, 2)
        admin.table("connected_accounts").update({"balance": new_balance}).eq("id", request.from_account_id).execute()

        # 4. Save confirmation message
        confirm_msg = f"Done! ${request.amount:,.0f} moved from {account.get('institution_name', 'account')} to {request.to_account}. New balance: ${new_balance:,.2f}"
        admin.table("chat_messages").insert({"user_id": current_user.id, "role": "assistant", "content": confirm_msg}).execute()

        return {
            "executed": True,
            "message": confirm_msg,
            "new_balance": new_balance,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execute error: {str(e)}")
