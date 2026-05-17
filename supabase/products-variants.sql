-- Products: status, multiple images + product variants
-- Run in Supabase SQL Editor after schema.sql

-- ---------------------------------------------------------------------------
-- Extend products
-- ---------------------------------------------------------------------------
alter table public.products
  add column if not exists status text not null default 'draft'
    check (status in ('active', 'draft'));

alter table public.products
  add column if not exists image_urls jsonb not null default '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- Product variants
-- ---------------------------------------------------------------------------
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  color text not null default '',
  size text not null default '',
  sale_price numeric(10, 2) not null check (sale_price >= 0),
  compare_price numeric(10, 2) check (compare_price is null or compare_price >= 0),
  cost_price numeric(10, 2) check (cost_price is null or cost_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, color, size)
);

create index if not exists product_variants_product_id_idx
  on public.product_variants (product_id);

alter table public.product_variants enable row level security;

create policy "Product variants are viewable by everyone"
  on public.product_variants for select
  using (true);
