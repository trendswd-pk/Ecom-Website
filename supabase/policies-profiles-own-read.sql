-- Safe to re-run (idempotent).
-- Use when migrating from the old "Profiles are not publicly readable" policy.

drop policy if exists "Profiles are not publicly readable" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);
