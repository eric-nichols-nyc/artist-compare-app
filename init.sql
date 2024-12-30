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
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS vector;

-- Add any other initialization SQL here
