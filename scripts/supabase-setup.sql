-- Run this ONCE in Supabase SQL Editor (arsi-platform project)
-- These functions allow the provisioning script to create schemas and run SQL

-- Function to create a new client schema
CREATE OR REPLACE FUNCTION create_client_schema(
  schema_name text
) RETURNS void AS $$
BEGIN
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute SQL within a schema
CREATE OR REPLACE FUNCTION exec_sql_in_schema(
  schema_name text,
  sql_query text
) RETURNS void AS $$
BEGIN
  EXECUTE format('SET search_path TO %I; %s', schema_name, sql_query);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to service role
GRANT EXECUTE ON FUNCTION create_client_schema TO service_role;
GRANT EXECUTE ON FUNCTION exec_sql_in_schema TO service_role;
