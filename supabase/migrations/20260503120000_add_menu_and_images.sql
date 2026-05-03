-- ─────────────────────────────────────────────────────────────
-- Adds AI-generated menu items + curated stock photo URLs to
-- onboarding_submissions. These columns are populated during the
-- provisioning pipeline (after AI copy generation, before seeding)
-- and consumed by the per-customer schema seeder to fill
-- site_settings + menu_items in client_<slug>.*.
--
-- Also adds cuisine_type captured from intake (used to specialize
-- the menu prompt and image search queries).
--
-- Run manually in Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE cimaasites.onboarding_submissions
  ADD COLUMN IF NOT EXISTS generated_menu_items  jsonb,
  ADD COLUMN IF NOT EXISTS generated_hero_image  text,
  ADD COLUMN IF NOT EXISTS generated_about_image text,
  ADD COLUMN IF NOT EXISTS generated_menu_images jsonb,
  ADD COLUMN IF NOT EXISTS generated_gallery     jsonb,
  ADD COLUMN IF NOT EXISTS cuisine_type          text;
