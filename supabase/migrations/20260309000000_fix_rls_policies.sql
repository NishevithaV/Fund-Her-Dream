-- Fix 1: Remove public INSERT on contributions.
-- Anyone could previously inject fake contributions directly via the Supabase client.
-- Service role (used by verify-payment edge function) bypasses RLS entirely, so it still works.
DROP POLICY IF EXISTS "Anyone can insert contributions" ON public.contributions;

-- Fix 2: Remove the overly-permissive ideas UPDATE policy.
-- USING (true) WITH CHECK (true) allowed ANY role (including anon) to update any idea.
-- Service role bypasses RLS, so verify-payment can still increment amount_raised/backer_count.
DROP POLICY IF EXISTS "Service role can update ideas" ON public.ideas;
