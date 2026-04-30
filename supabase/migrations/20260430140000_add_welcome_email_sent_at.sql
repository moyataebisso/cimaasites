-- ─────────────────────────────────────────────────────────────
-- Idempotency guard for the welcome email step in provisioning.
--
-- Without this, a re-run of /api/onboard/provision (whether from a
-- duplicate Stripe webhook or a manual retry) would dispatch the
-- "your site is ready" email twice. We stamp the timestamp once on
-- successful send and skip the step on subsequent runs.
--
-- Run manually in Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE cimaasites.onboarding_submissions
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at timestamptz;
