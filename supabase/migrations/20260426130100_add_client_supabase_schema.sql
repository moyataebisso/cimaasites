-- Adds client_supabase_schema to onboarding_submissions so we can persist the
-- per-customer Postgres schema name created during provisioning.
-- Run manually in Supabase SQL Editor.

ALTER TABLE cimaasites.onboarding_submissions
  ADD COLUMN IF NOT EXISTS client_supabase_schema text;
