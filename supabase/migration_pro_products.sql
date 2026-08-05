-- ============================================================
-- MIGRATION : Module "Gestion des produits" version Pro
-- ============================================================
-- À exécuter UNE SEULE FOIS si vous avez déjà exécuté schema.sql
-- avant cette mise à jour. Si vous configurez Supabase pour la
-- première fois, inutile d'exécuter ce fichier : schema.sql (déjà
-- mis à jour) contient directement toutes ces colonnes.
--
-- Ce script est écrit pour être sans danger (IF NOT EXISTS partout) :
-- vous pouvez le relancer sans risque de casser vos données existantes.

alter table products add column if not exists brand text default '';
alter table products add column if not exists weight_grams int;
alter table products add column if not exists sku text;
alter table products add column if not exists status text not null default 'active';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_sku_key') then
    alter table products add constraint products_sku_key unique (sku);
  end if;
exception when others then
  null; -- ignore si des doublons de sku existent déjà ; à nettoyer manuellement
end $$;

create index if not exists idx_products_status on products(status);

alter table product_variants add column if not exists color_image_url text;
alter table product_variants add column if not exists sku text;

alter table orders add column if not exists stock_decremented boolean not null default false;

create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references product_variants(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  change int not null,
  reason text default '',
  created_at timestamptz default now()
);

create index if not exists idx_stock_movements_variant on stock_movements(variant_id);
create index if not exists idx_stock_movements_product on stock_movements(product_id);

alter table stock_movements enable row level security;

create or replace function decrement_stock(variant_id uuid, qty int)
returns void as $$
declare
  v_product_id uuid;
begin
  select product_id into v_product_id from product_variants where id = variant_id;

  update product_variants
  set stock_quantity = greatest(stock_quantity - qty, 0)
  where id = variant_id;

  insert into stock_movements (variant_id, product_id, change, reason)
  values (variant_id, v_product_id, -qty, 'commande');
end;
$$ language plpgsql security definer;

create or replace function increment_stock(variant_id uuid, qty int, reason text default 'annulation')
returns void as $$
declare
  v_product_id uuid;
begin
  select product_id into v_product_id from product_variants where id = variant_id;

  update product_variants
  set stock_quantity = stock_quantity + qty
  where id = variant_id;

  insert into stock_movements (variant_id, product_id, change, reason)
  values (variant_id, v_product_id, qty, reason);
end;
$$ language plpgsql security definer;

-- Remplit un statut cohérent pour les produits déjà existants
update products set status = case when is_active then 'active' else 'hidden' end
where status is null or status = 'active';
