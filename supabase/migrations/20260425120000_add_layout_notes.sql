-- Adds layout_notes (free-form customer notes about layout preference) to onboarding_submissions.
-- Also defensively ensures selected_layout exists in case earlier migration was skipped.
-- Run manually in Supabase SQL Editor (cimaasites schema).

ALTER TABLE cimaasites.onboarding_submissions
  ADD COLUMN IF NOT EXISTS selected_layout text DEFAULT 'fleet';

ALTER TABLE cimaasites.onboarding_submissions
  ADD COLUMN IF NOT EXISTS layout_notes text;
