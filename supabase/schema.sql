-- E-commerce schema for Supabase
-- Run in: Supabase Dashboard → SQL Editor → New query

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  image_url text,
  category_id uuid references public.categories (id) on delete set null
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_created_at_idx on public.products (created_at desc);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  status text not null default 'pending' check (
    status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled')
  )
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Storefront: public read access
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- Orders: no public access by default (manage via service role / future policies)
create policy "Orders are not publicly readable"
  on public.orders for select
  using (false);

-- Writes from the app use the service role key in server actions (bypasses RLS).
-- Optional: tighten with authenticated admin policies once Supabase Auth is added.

-- User profiles: run supabase/profiles.sql after this file.
