"""
FinishLine Backend — Opportunity Detector
The brain of FinishLine: detects financial opportunities from account data.
Pure Python logic — no ML model needed for MVP.
"""
from datetime import date, timedelta, datetime
from typing import Optional


class OpportunityDetector:
    """Detects financial optimization opportunities from user's bank data."""

    def detect_idle_cash(self, user: dict, accounts: list, transactions: list) -> Optional[dict]:
        """
        Detect idle cash sitting in chequing accounts.
        Logic: balance > (avg monthly spend × 1.5) AND salary detected in last 3 days.
        """
        # Find chequing accounts
        chequing_accounts = [a for a in accounts if a.get("account_type") in ("checking", "chequing", "depository", "savings", "money market", "cash management", "hsa")]
        if not chequing_accounts:
            return None

        total_balance = sum(a.get("balance", 0) for a in chequing_accounts)
        if total_balance <= 0:
            return None

        # Calculate avg monthly spend from transactions (last 90 days)
        # Plaid: positive amounts = spending, negative = income
        spending_txns = [t for t in transactions if t.get("amount", 0) > 0]
        total_spend = sum(t.get("amount", 0) for t in spending_txns)
        avg_monthly_spend = total_spend / 3 if total_spend > 0 else 1000  # default fallback

        # Check if salary landed in last 3 days
        three_days_ago = (date.today() - timedelta(days=3)).isoformat()
        salary_txns = [
            t for t in transactions
            if t.get("is_salary", False) and str(t.get("date", "")) >= three_days_ago
        ]
        salary_detected = len(salary_txns) > 0

        # Also detect large income deposits as salary proxy
        if not salary_detected:
            recent_income = [
                t for t in transactions
                if t.get("amount", 0) < -(avg_monthly_spend * 0.8)
                and str(t.get("date", "")) >= three_days_ago
            ]
            salary_detected = len(recent_income) > 0

        # Check idle cash threshold
        if total_balance <= avg_monthly_spend * 1.5:
            return None

        # Calculate opportunity
        idle_amount = round(total_balance - (avg_monthly_spend * 1.2), 2)  # keep a buffer
        if idle_amount < 100:
            return None

        impact_value = round(idle_amount * 0.05, 2)  # 5% TFSA rate
        confidence = 0.85 if salary_detected else 0.75

        return {
            "type": "idle_cash",
            "title": "Idle cash detected in your chequing account",
            "amount": idle_amount,
            "impact_text": f"${idle_amount:,.0f} sitting idle → ${impact_value:,.0f}/yr in TFSA at 5%",
            "impact_value": impact_value,
            "priority": "urgent" if salary_detected else "high",
            "confidence_score": confidence,
            "status": "pending",
        }

    def detect_rrsp_deadline(self, user: dict, accounts: list) -> Optional[dict]:
        """
        Detect RRSP contribution deadline approaching (Canada only).
        Logic: country == CA AND days until March 1 < 45.
        """
        if user.get("country", "").upper() != "CA":
            return None

        # Calculate days to March 1 deadline
        today = date.today()
        year = today.year if today.month < 3 else today.year + 1
        deadline = date(year, 3, 1)
        days_left = (deadline - today).days

        if days_left > 45:
            return None

        # Get available balance
        chequing_balance = sum(
            a.get("balance", 0) for a in accounts
            if a.get("account_type") in ("checking", "chequing", "depository", "savings", "money market", "cash management", "hsa")
        )

        if chequing_balance < 500:
            return None

        # Calculate suggestion
        tax_bracket = user.get("tax_bracket", 0.30)
        suggested_amount = round(min(chequing_balance * 0.3, 10000), 2)  # cap at 10k
        tax_saved = round(suggested_amount * tax_bracket, 2)

        return {
            "type": "rrsp_deadline",
            "title": f"RRSP deadline in {days_left} days — contribute before March 1",
            "amount": suggested_amount,
            "impact_text": f"Contributing ${suggested_amount:,.0f} saves ${tax_saved:,.0f} in taxes",
            "impact_value": tax_saved,
            "priority": "urgent",
            "confidence_score": 0.90,
            "status": "pending",
        }

    def detect_tfsa_room(self, user: dict, accounts: list) -> Optional[dict]:
        """
        Detect unused TFSA contribution room (Canada only).
        Logic: chequing balance > $1000 — suggest moving funds to TFSA.
        """
        if user.get("country", "").upper() != "CA":
            return None

        chequing_balance = sum(
            a.get("balance", 0) for a in accounts
            if a.get("account_type") in ("checking", "chequing", "depository", "savings", "money market", "cash management", "hsa")
        )

        if chequing_balance < 1000:
            return None

        # Suggest moving excess above a $1000 buffer
        suggested_amount = round(chequing_balance - 1000, 2)
        if suggested_amount < 500:
            return None

        # Cap at $7000 (2024 TFSA annual limit)
        suggested_amount = min(suggested_amount, 7000)
        impact_value = round(suggested_amount * 0.05, 2)

        return {
            "type": "tfsa_room",
            "title": "You may have unused TFSA contribution room",
            "amount": suggested_amount,
            "impact_text": f"Moving ${suggested_amount:,.0f} to TFSA earns ${impact_value:,.0f}/yr tax-free",
            "impact_value": impact_value,
            "priority": "high",
            "confidence_score": 0.75,
            "status": "pending",
        }

    def detect_salary_autopilot(self, user: dict, accounts: list, transactions: list) -> Optional[dict]:
        """
        Salary Autopilot — detects salary landing and suggests optimal split
        across RRSP, credit card debt, TFSA, and chequing buffer.
        """
        import json

        # Step 1: Find salary transaction (last 3 days)
        three_days_ago = (date.today() - timedelta(days=3)).isoformat()
        monthly_income = user.get("monthly_income", 0)

        salary_txn = None
        for t in transactions:
            if t.get("is_salary") and str(t.get("date", "")) >= three_days_ago:
                salary_txn = t
                break

        # Fallback: large deposit > 70% of monthly income
        if not salary_txn and monthly_income > 0:
            for t in transactions:
                amt = abs(t.get("amount", 0))
                if amt > monthly_income * 0.7 and t.get("amount", 0) < 0 and str(t.get("date", "")) >= three_days_ago:
                    salary_txn = t
                    break

        if not salary_txn:
            return None

        # Step 2: Verify chequing account
        chequing = None
        for a in accounts:
            if a.get("account_type") in ("checking", "chequing", "depository"):
                chequing = a
                break
        if not chequing:
            return None

        salary = abs(salary_txn.get("amount", 0))
        if salary < 500:
            return None

        # Step 3: Calculate split in priority order
        remaining = salary
        moves = []
        tax_bracket = user.get("tax_bracket", 0.30)
        rrsp_room = user.get("rrsp_room", 0)
        tfsa_room = user.get("tfsa_room", 0)
        tax_saved = 0
        interest_saved = 0

        # Priority 1: RRSP (if room and deadline within 60 days)
        today = date.today()
        year = today.year if today.month < 3 else today.year + 1
        deadline = date(year, 3, 1)
        days_to_deadline = (deadline - today).days

        if rrsp_room > 0 and days_to_deadline < 60 and user.get("country", "").upper() == "CA":
            rrsp_amount = min(rrsp_room, salary * 0.15)
            rrsp_amount = round(rrsp_amount, 2)
            tax_saved = round(rrsp_amount * tax_bracket, 2)
            moves.append({
                "type": "rrsp",
                "amount": rrsp_amount,
                "label": f"RRSP contribution — saves ${tax_saved:,.0f} in taxes",
            })
            remaining -= rrsp_amount

        # Priority 2: Credit card debt
        cc_spending = sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) > 0 and "credit" in str(t.get("category", "")).lower())
        cc_balance = min(cc_spending * 0.3, salary * 0.15)
        if cc_balance > 50:
            cc_amount = round(cc_balance, 2)
            monthly_interest = round(cc_amount * 0.02, 2)
            interest_saved += monthly_interest
            moves.append({
                "type": "debt",
                "amount": cc_amount,
                "label": f"Credit card paydown — saves ${monthly_interest:,.0f}/mo interest",
            })
            remaining -= cc_amount

        # Priority 3: TFSA
        if tfsa_room > 0 and remaining > monthly_income * 2 and user.get("country", "").upper() == "CA":
            tfsa_amount = min(tfsa_room, salary * 0.12)
            tfsa_amount = round(tfsa_amount, 2)
            moves.append({
                "type": "tfsa",
                "amount": tfsa_amount,
                "label": f"TFSA top-up — grows tax-free",
            })
            remaining -= tfsa_amount

        # Priority 4: Keep rest in chequing
        remaining = round(remaining, 2)
        moves.append({
            "type": "keep",
            "amount": remaining,
            "label": f"Keep in chequing — 2-month buffer",
        })

        if len(moves) < 2:
            return None  # Not useful if only "keep"

        non_keep_total = sum(m["amount"] for m in moves if m["type"] != "keep")

        return {
            "type": "salary_autopilot",
            "title": f"Salary Autopilot — ${salary:,.0f} landed",
            "amount": salary,
            "impact_text": f"Optimize ${non_keep_total:,.0f} across {len([m for m in moves if m['type'] != 'keep'])} moves",
            "impact_value": tax_saved + interest_saved,
            "priority": "urgent",
            "confidence_score": 0.95,
            "status": "pending",
            "extra_data": json.dumps(moves),
        }

    def run_all_detectors(self, user: dict, accounts: list, transactions: list) -> list:
        """
        Run all detection methods and return up to 3 highest-priority opportunities.
        """
        opportunities = []

        # Run each detector
        detectors = [
            lambda: self.detect_salary_autopilot(user, accounts, transactions),
            lambda: self.detect_idle_cash(user, accounts, transactions),
            lambda: self.detect_rrsp_deadline(user, accounts),
            lambda: self.detect_tfsa_room(user, accounts),
        ]

        for detector in detectors:
            try:
                result = detector()
                if result and result["confidence_score"] >= 0.70:
                    opportunities.append(result)
            except Exception:
                continue  # Don't crash the entire scan if one detector fails

        # Sort by priority: urgent > high > medium > low
        priority_order = {"urgent": 0, "high": 1, "medium": 2, "low": 3}
        opportunities.sort(key=lambda x: priority_order.get(x["priority"], 99))

        # Max 3 per scan
        return opportunities[:3]

