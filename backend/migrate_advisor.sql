-- ============================================================
-- FinishLine — Advisor Integration Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This adds the missing columns and tables needed for real-time
-- advisor ↔ consumer integration.
-- ============================================================

-- 1. Add 'role' column to users table (defaults to 'user')
-- ============================================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update existing @finishline.com users to 'advisor' role
UPDATE public.users SET role = 'advisor' WHERE email LIKE '%@finishline.com' AND role = 'user';


-- 2. Create advisor_alerts table (stores alerts sent by advisors to clients)
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

-- Advisors can read alerts they sent
CREATE POLICY "Advisors can read own sent alerts" ON public.advisor_alerts
    FOR SELECT USING (auth.uid() = advisor_id);

-- Clients can read alerts sent to them
CREATE POLICY "Clients can read alerts sent to them" ON public.advisor_alerts
    FOR SELECT USING (auth.uid() = client_user_id);

-- Service role inserts (backend uses admin client)
CREATE POLICY "Service can insert alerts" ON public.advisor_alerts
    FOR INSERT WITH CHECK (true);


-- ============================================================
-- DONE! Run this once in your Supabase SQL Editor.
-- ============================================================
