-- Collections for storefront navigation + product grouping
-- Run in Supabase SQL Editor after schema.sql

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  show_in_menu boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collections_sort_order_idx
  on public.collections (sort_order asc, name asc);

create index if not exists collections_show_in_menu_idx
  on public.collections (show_in_menu)
  where show_in_menu = true;

create table if not exists public.product_collections (
  product_id uuid not null references public.products (id) on delete cascade,
  collection_id uuid not null references public.collections (id) on delete cascade,
  primary key (product_id, collection_id)
);

create index if not exists product_collections_collection_id_idx
  on public.product_collections (collection_id);

alter table public.collections enable row level security;
alter table public.product_collections enable row level security;

create policy "Collections are viewable by everyone"
  on public.collections for select
  using (true);

create policy "Product collections are viewable by everyone"
  on public.product_collections for select
  using (true);

-- Admin writes use service role in server actions.
