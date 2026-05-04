-- Migration: Create patisserie_products table
-- Date: 2026-04-26

create table public.patisserie_products (
  id             uuid          primary key default gen_random_uuid(),
  name           text          not null,
  description    text          not null,
  price          numeric       not null check (price >= 0),
  pathname       text          not null unique,
  image_url      text,
  thumbnail_url  text,
  active         boolean       not null default true,
  category       text,
  stock_status   text          not null default 'on_request'
                   check (stock_status in ('available', 'out_of_stock', 'on_request')),
  metadata       jsonb,
  created_at     timestamptz   not null default now(),
  updated_at     timestamptz   not null default now()
);

-- Índices
create index patisserie_products_active_idx on public.patisserie_products (active);
create index patisserie_products_pathname_idx on public.patisserie_products (pathname);
create index patisserie_products_category_idx on public.patisserie_products (category);

-- RLS
alter table public.patisserie_products enable row level security;

-- Lectura pública: solo productos activos
create policy "Public read active patisserie products"
  on public.patisserie_products
  for select
  using (active = true);

-- Acceso completo para usuarios autenticados (backoffice)
create policy "Authenticated full access to patisserie products"
  on public.patisserie_products
  for all
  using (auth.role() = 'authenticated');