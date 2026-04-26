-- Adds checkout_url to onboarding_submissions so admin approve flow can persist the
-- Stripe checkout URL alongside stripe_session_id for re-sending and copy/open actions.
-- Run manually in Supabase SQL Editor (cimaasites schema).

ALTER TABLE cimaasites.onboarding_submissions
  ADD COLUMN IF NOT EXISTS checkout_url text;
