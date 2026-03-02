-- ============================================================
-- FinishLine — Complete Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- 1. USERS TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT 'CA',
    tax_bracket NUMERIC DEFAULT 0,
    monthly_income NUMERIC DEFAULT 0,
    role TEXT DEFAULT 'user',  -- 'user' or 'advisor'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);


-- 2. CONNECTED ACCOUNTS (Plaid bank connections)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.connected_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    plaid_item_id TEXT,
    plaid_access_token TEXT,  -- NEVER expose to frontend
    institution_name TEXT DEFAULT '',
    account_type TEXT DEFAULT 'checking',
    plaid_account_id TEXT,
    balance NUMERIC DEFAULT 0,
    last_synced TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own accounts" ON public.connected_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON public.connected_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON public.connected_accounts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON public.connected_accounts
    FOR DELETE USING (auth.uid() = user_id);


-- 3. TRANSACTIONS (from Plaid)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES public.connected_accounts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    category TEXT DEFAULT '',
    merchant_name TEXT DEFAULT '',
    is_salary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 4. OPPORTUNITIES (AI-detected financial opportunities)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,  -- idle_cash, rrsp_deadline, tfsa_room, portfolio_drift, high_interest_debt, salary_optimization
    title TEXT NOT NULL,
    amount NUMERIC DEFAULT 0,
    impact_text TEXT DEFAULT '',
    impact_value NUMERIC DEFAULT 0,
    priority TEXT DEFAULT 'medium',  -- urgent, high, medium, low
    confidence_score NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',  -- pending, approved, skipped
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own opportunities" ON public.opportunities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own opportunities" ON public.opportunities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own opportunities" ON public.opportunities
    FOR UPDATE USING (auth.uid() = user_id);


-- 5. ACTION BRIEFS (Claude-generated briefs for opportunities)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.action_briefs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    brief_text TEXT NOT NULL,
    model_used TEXT DEFAULT 'claude-sonnet-4-5',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.action_briefs ENABLE ROW LEVEL SECURITY;

-- Briefs are readable if the user owns the parent opportunity
CREATE POLICY "Users can read own briefs" ON public.action_briefs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.opportunities 
            WHERE opportunities.id = action_briefs.opportunity_id 
            AND opportunities.user_id = auth.uid()
        )
    );

CREATE POLICY "Service can insert briefs" ON public.action_briefs
    FOR INSERT WITH CHECK (true);  -- Backend service inserts these


-- 6. USER ACTIONS (approval/skip decisions)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    decision TEXT NOT NULL,  -- approved, skipped
    decided_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own actions" ON public.user_actions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own actions" ON public.user_actions
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 7. GOALS (user financial goals)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'savings',  -- retirement, emergency, savings, custom
    target_amount NUMERIC NOT NULL DEFAULT 0,
    current_amount NUMERIC DEFAULT 0,
    deadline TEXT,  -- ISO date string
    monthly_contribution NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active',  -- active, completed, paused
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.goals
    FOR DELETE USING (auth.uid() = user_id);


-- 8. SCAN LOGS (audit log of nightly AI scans)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.scan_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    opportunities_found INTEGER DEFAULT 0,
    status TEXT DEFAULT 'completed'  -- completed, failed
);

ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scan logs" ON public.scan_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert scan logs" ON public.scan_logs
    FOR INSERT WITH CHECK (true);


-- ============================================================
-- ADVISOR ALERTS (messages sent by advisors to clients)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.advisor_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    advisor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    client_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.advisor_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Advisors can read own sent alerts" ON public.advisor_alerts
    FOR SELECT USING (auth.uid() = advisor_id);

CREATE POLICY "Clients can read alerts sent to them" ON public.advisor_alerts
    FOR SELECT USING (auth.uid() = client_user_id);

CREATE POLICY "Service can insert alerts" ON public.advisor_alerts
    FOR INSERT WITH CHECK (true);


-- ============================================================
-- DONE! All 9 tables created with RLS enabled.
-- ============================================================
