-- ─────────────────────────────────────────────────────────────
-- Adds the Step-2 intake plumbing onto onboarding_submissions.
--
-- Flow now spans:
--   pending      → contact form submitted (Step 1)
--   intake_sent  → admin sent /intake/[token] link
--   intake_done  → customer finished intake form (Step 2)
--   approved     → admin generated Stripe checkout
--   paid → live  → existing
--
-- Run manually in Supabase SQL Editor — not auto-applied.
-- ─────────────────────────────────────────────────────────────

-- Token defaults to 16 random bytes hex-encoded (32 chars).
-- gen_random_bytes is provided by pgcrypto; ensure the extension exists.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE cimaasites.onboarding_submissions
  ADD COLUMN IF NOT EXISTS intake_token        text,
  ADD COLUMN IF NOT EXISTS intake_sent_at      timestamptz,
  ADD COLUMN IF NOT EXISTS intake_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS intake_data         jsonb;

-- Backfill existing rows with unique tokens so the UNIQUE constraint
-- below can be applied without conflicts. gen_random_bytes() is
-- volatile, so each row gets a distinct value.
UPDATE cimaasites.onboarding_submissions
   SET intake_token = encode(gen_random_bytes(16), 'hex')
 WHERE intake_token IS NULL;

-- Future inserts get a default if the API forgets to provide one.
ALTER TABLE cimaasites.onboarding_submissions
  ALTER COLUMN intake_token
  SET DEFAULT encode(gen_random_bytes(16), 'hex');

-- Constrain + index for fast /intake/[token] lookups.
ALTER TABLE cimaasites.onboarding_submissions
  ADD CONSTRAINT onboarding_submissions_intake_token_unique
  UNIQUE (intake_token);

CREATE INDEX IF NOT EXISTS onboarding_submissions_intake_token_idx
  ON cimaasites.onboarding_submissions (intake_token);
