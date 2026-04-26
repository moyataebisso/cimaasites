-- Per-customer schema template.
--
-- This file is NOT run directly by Supabase. The cimaasites provisioning code
-- (src/lib/provision/create-client-schema.ts) reads this file at runtime,
-- substitutes __SCHEMA__ with the actual client_<slug> name, and executes
-- each statement via cimaasites.exec_sql() during onboarding.
--
-- Source-controlled here so all client schemas stay in lockstep when we add
-- new tables. To roll out a new table to all clients, add it here AND ship a
-- separate forward migration that loops existing client schemas.
--
-- Conventions:
--   __SCHEMA__ — placeholder replaced at runtime with `client_<slug>`
--   gen_random_uuid() — provided by pgcrypto, already enabled in this project
--   service_role     — Supabase admin role used by the starter-app server-side
--   authenticated/anon — Supabase end-user roles (need USAGE so PostgREST can
--                        enumerate tables when SUPABASE_SCHEMA is set)

CREATE SCHEMA IF NOT EXISTS __SCHEMA__;

CREATE TABLE IF NOT EXISTS __SCHEMA__.site_settings (
  key text PRIMARY KEY,
  value text,
  value_json jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS __SCHEMA__.booking_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration_minutes int DEFAULT 60,
  price int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

GRANT USAGE ON SCHEMA __SCHEMA__ TO service_role, authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA __SCHEMA__ TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA __SCHEMA__ TO authenticated, anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA __SCHEMA__
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA __SCHEMA__
  GRANT SELECT ON TABLES TO authenticated, anon;
