-- One-time setup. Run this manually in Supabase SQL Editor before the first
-- multi-tenant provisioning run.
--
-- Creates a security-definer helper that the cimaasites provisioning code
-- invokes via supabaseAdmin.rpc('exec_sql', { sql }) to materialize a per-
-- customer schema (CREATE SCHEMA + CREATE TABLE + GRANT). It bypasses the
-- normal RPC restriction on raw DDL by running with the function owner's
-- privileges.
--
-- WARNING: Only the service_role can EXECUTE this function. Anon and
-- authenticated roles must NEVER be granted access — that would be a full
-- database takeover primitive.

CREATE OR REPLACE FUNCTION cimaasites.exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

REVOKE ALL ON FUNCTION cimaasites.exec_sql(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION cimaasites.exec_sql(text) FROM anon;
REVOKE ALL ON FUNCTION cimaasites.exec_sql(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION cimaasites.exec_sql(text) TO service_role;
