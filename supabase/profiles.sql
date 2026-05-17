-- User profiles linked to Supabase Auth
-- Run after enabling Auth in your Supabase project.
--
-- PASSWORDS (important):
--   • Never store plain-text or custom-hashed passwords in public.profiles.
--   • Passwords belong only in auth.users — Supabase Auth hashes them (bcrypt)
--     in the encrypted_password column automatically on sign-up / password set.
--   • The app uses signInWithPassword(); it never compares passwords in SQL.

-- ---------------------------------------------------------------------------
-- Profiles (role & permissions only — no password column)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists profiles_role_idx on public.profiles (role);

-- Auto-create profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, permissions)
  values (
    new.id,
    new.email,
    'viewer',
    '{"can_view": true, "can_edit": false, "can_delete": false}'::jsonb
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Keep updated_at in sync
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_profiles_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Signed-in users can read their own profile (for admin session & permissions).
drop policy if exists "Profiles are not publicly readable" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Optional: seed your admin profile (replace UUID and email)
-- ---------------------------------------------------------------------------
-- insert into public.profiles (id, email, role, permissions)
-- values (
--   'your-auth-user-uuid',
--   'admin@example.com',
--   'admin',
--   '{"can_view": true, "can_edit": true, "can_delete": true}'::jsonb
-- )
-- on conflict (id) do update
-- set role = excluded.role, permissions = excluded.permissions, email = excluded.email;
