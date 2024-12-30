-- Only create role if it doesn't exist
DO $$ 
BEGIN
  CREATE ROLE supabase_admin;
  EXCEPTION WHEN DUPLICATE_OBJECT THEN
  RAISE NOTICE 'Role supabase_admin already exists';
END
$$;

-- Make sure the role has the right permissions
ALTER ROLE supabase_admin WITH SUPERUSER CREATEDB CREATEROLE;

-- Now create extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Add any other initialization SQL here
