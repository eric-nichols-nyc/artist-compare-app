-- Create roles
DO $$ 
BEGIN
  CREATE ROLE supabase_admin;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'Role supabase_admin already exists';
END
$$;

ALTER ROLE supabase_admin WITH SUPERUSER CREATEDB CREATEROLE;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- Create schema for pg_stat_statements if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Create pg_stat_statements extension in the extensions schema
CREATE EXTENSION IF NOT EXISTS pg_stat_statements SCHEMA extensions;

-- Add any other initialization SQL here
