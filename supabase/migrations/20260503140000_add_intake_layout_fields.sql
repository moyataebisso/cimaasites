-- ─────────────────────────────────────────────────────────────
-- Adds the layout-specific intake fields captured by the expanded
-- IntakeForm. The form now branches based on selected_layout into
-- restaurant / salon / auto / general field bundles, plus a
-- universal "Tell us your story" step that AI generation reads.
--
-- All ALTER TABLE statements use IF NOT EXISTS so this migration is
-- safe to run repeatedly and tolerant of cuisine_type being created
-- by 20260503120000_add_menu_and_images.sql in either order.
--
-- Run manually in Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE cimaasites.onboarding_submissions
  -- Universal
  ADD COLUMN IF NOT EXISTS business_story        text,
  ADD COLUMN IF NOT EXISTS years_in_business     integer,

  -- Restaurant / bistro
  ADD COLUMN IF NOT EXISTS cuisine_type          text,
  ADD COLUMN IF NOT EXISTS dietary_options       jsonb,
  ADD COLUMN IF NOT EXISTS reservations          text,
  ADD COLUMN IF NOT EXISTS takeout               text,
  ADD COLUMN IF NOT EXISTS delivery              text,
  ADD COLUMN IF NOT EXISTS seating_capacity      integer,
  ADD COLUMN IF NOT EXISTS atmosphere            jsonb,

  -- Salon / spa
  ADD COLUMN IF NOT EXISTS salon_services        jsonb,
  ADD COLUMN IF NOT EXISTS booking_required      text,
  ADD COLUMN IF NOT EXISTS staff_count           integer,
  ADD COLUMN IF NOT EXISTS products_sold         boolean,
  ADD COLUMN IF NOT EXISTS specializations       text,

  -- Auto / mechanic
  ADD COLUMN IF NOT EXISTS auto_services         jsonb,
  ADD COLUMN IF NOT EXISTS makes_models          text,
  ADD COLUMN IF NOT EXISTS certifications        text,
  ADD COLUMN IF NOT EXISTS warranty              text,
  ADD COLUMN IF NOT EXISTS loaner_vehicles       boolean,

  -- General service
  ADD COLUMN IF NOT EXISTS service_area_radius   integer;
