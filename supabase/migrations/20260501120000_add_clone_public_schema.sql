-- ─────────────────────────────────────────────────────────────
-- Replaces the hand-maintained client_schema_template.sql with a
-- live clone of the public schema. The starter-app's full table
-- set lives in public.* — this function copies that whole structure
-- (NOT data) into a per-customer schema in one call.
--
-- Idempotent: every CREATE TABLE uses IF NOT EXISTS, schema creation
-- is IF NOT EXISTS, and re-running on an existing target schema is
-- a no-op for tables that already match.
--
-- Run manually in Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION cimaasites.clone_public_to_schema(target_schema text)
RETURNS void AS $$
DECLARE
  tbl record;
BEGIN
  -- Create the target schema if it doesn't exist.
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', target_schema);

  -- For each base table in public, clone its structure (NOT data) into
  -- the target schema. INCLUDING ALL copies defaults, constraints,
  -- indexes, comments, storage parameters, and identity columns —
  -- everything except foreign-key targets that point outside public.
  FOR tbl IN
    SELECT tablename
      FROM pg_tables
     WHERE schemaname = 'public'
     ORDER BY tablename
  LOOP
    BEGIN
      EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I.%I (LIKE public.%I INCLUDING ALL)',
        target_schema, tbl.tablename, tbl.tablename
      );
      RAISE NOTICE 'Created table %.%', target_schema, tbl.tablename;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to create %.%: %', target_schema, tbl.tablename, SQLERRM;
    END;
  END LOOP;

  -- Grants so the starter-app's PostgREST exposure works the same way
  -- the existing template hands them out.
  EXECUTE format('GRANT USAGE ON SCHEMA %I TO service_role, authenticated, anon', target_schema);
  EXECUTE format('GRANT ALL ON ALL TABLES IN SCHEMA %I TO service_role', target_schema);
  EXECUTE format('GRANT SELECT ON ALL TABLES IN SCHEMA %I TO authenticated, anon', target_schema);
  EXECUTE format(
    'ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT ALL ON TABLES TO service_role',
    target_schema
  );
  EXECUTE format(
    'ALTER DEFAULT PRIVILEGES IN SCHEMA %I GRANT SELECT ON TABLES TO authenticated, anon',
    target_schema
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION cimaasites.clone_public_to_schema(text) TO service_role;

COMMENT ON FUNCTION cimaasites.clone_public_to_schema(text) IS
  'Clones every table from public schema into target_schema with INCLUDING ALL (constraints, indexes, defaults). Idempotent — safe to run multiple times.';

-- Companion verification helper. cimaasites.exec_sql returns void, so the
-- provisioning code can't use it to count tables — this RPC fills that gap.
CREATE OR REPLACE FUNCTION cimaasites.count_schema_tables(target_schema text)
RETURNS integer AS $$
DECLARE
  n integer;
BEGIN
  SELECT count(*)::int INTO n
    FROM information_schema.tables
   WHERE table_schema = target_schema
     AND table_type   = 'BASE TABLE';
  RETURN COALESCE(n, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

REVOKE ALL ON FUNCTION cimaasites.count_schema_tables(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION cimaasites.count_schema_tables(text) FROM anon;
REVOKE ALL ON FUNCTION cimaasites.count_schema_tables(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION cimaasites.count_schema_tables(text) TO service_role;
