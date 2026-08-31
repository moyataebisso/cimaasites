-- ─────────────────────────────────────────────────────────────
-- Hardens cimaasites.clone_public_to_schema:
--   * enables RLS on every cloned table (LIKE INCLUDING ALL does NOT
--     carry RLS state)
--   * grants only service_role on the schema and its tables
--   * revokes anon / authenticated even under default privileges, so
--     future tables created inside a tenant schema stay locked down
--
-- Supersedes the definition from 20260501120000_add_clone_public_schema.sql,
-- which granted SELECT to anon + authenticated and did not enable RLS.
-- Existing tenant schemas provisioned with the old grants are unaffected
-- by this migration — audit and remediate them separately.
--
-- Run manually in Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────

create or replace function cimaasites.clone_public_to_schema(target_schema text)
returns void
language plpgsql
security definer
as $function$
declare
  tbl record;
begin
  execute format('create schema if not exists %I', target_schema);

  for tbl in
    select tablename from pg_tables where schemaname = 'public' order by tablename
  loop
    begin
      execute format('create table if not exists %I.%I (like public.%I including all)',
                     target_schema, tbl.tablename, tbl.tablename);
      -- LIKE INCLUDING ALL does not carry RLS state; set it explicitly
      execute format('alter table %I.%I enable row level security',
                     target_schema, tbl.tablename);
    exception when others then
      raise warning 'Failed to create %.%: %', target_schema, tbl.tablename, sqlerrm;
    end;
  end loop;

  -- service_role only; the app reads via getAdminClient()
  execute format('grant usage on schema %I to service_role', target_schema);
  execute format('grant all on all tables    in schema %I to service_role', target_schema);
  execute format('grant all on all sequences in schema %I to service_role', target_schema);
  execute format('alter default privileges in schema %I grant all on tables    to service_role', target_schema);
  execute format('alter default privileges in schema %I grant all on sequences to service_role', target_schema);

  -- belt and braces: nothing for the browser key, now or later
  execute format('revoke all on all tables in schema %I from anon, authenticated', target_schema);
  execute format('alter default privileges in schema %I revoke all on tables from anon, authenticated', target_schema);
end;
$function$;
