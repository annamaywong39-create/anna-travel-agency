-- Check profiles RLS secured
-- Run this after RUN_NOW_ALL_FIXES.sql

-- 1) Is RLS enabled?
select schemaname, tablename, rowsecurity as rls_enabled
from pg_tables
where schemaname='public' and tablename='profiles';

-- 2) List all policies on profiles - should be ONLY own + admin, NOT public true
select policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname='public' and tablename='profiles'
order by policyname;

-- 3) Should NOT find any policy with qual = true for anon
-- This would be leak if exists:
select 'LEAK CHECK - should be 0 rows' as check, *
from pg_policies
where tablename='profiles' and qual = 'true' and 'anon' = ANY(roles);

-- 4) Expected secure policies (2-3 rows):
-- Users can view own profile: select to authenticated using (auth.uid() = id)
-- Admins can view all profiles: select to authenticated using (exists admin)
-- Users can update own safe fields: update using (auth.uid()=id)
-- Users can insert own profile

-- 5) Test as anon (should return 0 rows if secure)
-- Run as anon role - if you are logged in as service_role, this simulates anon:
-- set role anon; select count(*) from public.profiles; reset role;
-- If count >0 when anon, it's LEAKING

-- 6) Test as authenticated non-admin - should only see own row
-- As authenticated user, run: select count(*) from public.profiles;
-- Should be 1 (own) not all

select 'profiles RLS secured - if above shows only own+admin policies and no anon true, you are secure' as status;
