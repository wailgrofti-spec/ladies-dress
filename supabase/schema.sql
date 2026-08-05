-- ============================================================
-- LADIES DRESS — Schéma de base de données Supabase/PostgreSQL
-- ============================================================
-- À exécuter dans Supabase : Project > SQL Editor > New query
-- Colle tout ce fichier et clique sur "Run".

-- Extension pour générer des UUID
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- CATEGORIES (évolutif : chaussures aujourd'hui, vêtements/sacs demain)
-- ------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_fr text not null,
  name_ar text not null,
  name_en text not null,
  image_url text,
  parent_type text default 'chaussures', -- 'chaussures' | 'vetements' | 'sacs' | 'accessoires'
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  slug text unique not null,
  name_fr text not null,
  name_ar text not null,
  name_en text not null,
  description_fr text default '',
  description_ar text default '',
  description_en text default '',
  material text default '',
  brand text default '',
  weight_grams int,
  price numeric(10,2) not null,
  old_price numeric(10,2),
  sku text unique,
  is_new boolean default false,
  is_bestseller boolean default false,
  is_active boolean default true,
  status text not null default 'active', -- 'active' | 'hidden' | 'archived'
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_products_category on products(category_id);
create index idx_products_slug on products(slug);
create index idx_products_status on products(status);

-- ------------------------------------------------------------
-- PRODUCT IMAGES
-- ------------------------------------------------------------
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt_text_fr text default '',
  alt_text_ar text default '',
  alt_text_en text default '',
  sort_order int default 0,
  is_primary boolean default false
);

create index idx_product_images_product on product_images(product_id);

-- ------------------------------------------------------------
-- PRODUCT VARIANTS (stock par couleur + pointure)
-- ------------------------------------------------------------
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  color_name text not null,
  color_hex text default '#000000',
  color_image_url text,
  size text not null,
  sku text,
  stock_quantity int default 0,
  is_active boolean default true,
  unique (product_id, color_name, size)
);

create index idx_variants_product on product_variants(product_id);

-- ------------------------------------------------------------
-- STOCK MOVEMENTS (historique des entrées/sorties de stock)
-- ------------------------------------------------------------
create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references product_variants(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  change int not null, -- positif = ajout, négatif = retrait
  reason text default '', -- 'manuel' | 'commande' | 'retour' | 'correction'
  created_at timestamptz default now()
);

create index idx_stock_movements_variant on stock_movements(variant_id);
create index idx_stock_movements_product on stock_movements(product_id);

-- ------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  phone text not null,
  whatsapp text,
  city text not null,
  address text not null,
  neighborhood text default '',
  landmark text default '',
  payment_method text not null default 'cod', -- 'cod' | 'online' | 'bank_transfer'
  subtotal numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  promo_code text,
  comment text default '',
  status text not null default 'nouvelle',
  -- nouvelle | a_confirmer | confirmee | en_preparation | expediee | livree | annulee | refusee | retournee
  stock_decremented boolean not null default false,
  admin_notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_orders_status on orders(status);
create index idx_orders_created on orders(created_at desc);

-- ------------------------------------------------------------
-- ORDER ITEMS
-- ------------------------------------------------------------
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  color text,
  size text,
  price numeric(10,2) not null,
  quantity int not null default 1
);

create index idx_order_items_order on order_items(order_id);

-- ------------------------------------------------------------
-- SHIPPING ZONES
-- ------------------------------------------------------------
create table shipping_zones (
  id uuid primary key default gen_random_uuid(),
  city_name text not null,
  price numeric(10,2) not null default 25,
  is_active boolean default true,
  free_shipping_threshold numeric(10,2) default 500
);

-- ------------------------------------------------------------
-- PROMO CODES
-- ------------------------------------------------------------
create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null default 'percent', -- 'percent' | 'fixed'
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2) default 0,
  usage_limit int,
  used_count int default 0,
  expires_at timestamptz,
  is_active boolean default true
);

-- ------------------------------------------------------------
-- REVIEWS
-- ------------------------------------------------------------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text default '',
  photos text[] default '{}',
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- SITE SETTINGS (contenu modifiable sans toucher au code)
-- ------------------------------------------------------------
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value_fr text default '',
  value_ar text default '',
  value_en text default ''
);

-- ------------------------------------------------------------
-- PRODUCT VIEWS (pour le dashboard : "produits les plus consultés")
-- ------------------------------------------------------------
create table product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  viewed_at timestamptz default now()
);

create index idx_product_views_product on product_views(product_id);
create index idx_product_views_date on product_views(viewed_at desc);

-- ------------------------------------------------------------
-- ADMIN USERS (métadonnées ; l'authentification elle-même est
-- gérée par Supabase Auth — voir README pour créer le 1er compte)
-- ------------------------------------------------------------
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text default 'admin',
  created_at timestamptz default now()
);

-- ============================================================
-- FONCTION : décrémente le stock d'une variante lors d'une commande
-- ============================================================
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

-- Fonction inverse : restitue le stock (ex: commande confirmée puis annulée/retournée)
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

-- ============================================================
-- RLS (Row Level Security) — sécurité des données
-- ============================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table shipping_zones enable row level security;
alter table promo_codes enable row level security;
alter table reviews enable row level security;
alter table site_settings enable row level security;
alter table admin_users enable row level security;
alter table product_views enable row level security;
alter table stock_movements enable row level security;

-- Lecture publique des données catalogue (boutique visible sans compte)
create policy "public_read_categories" on categories for select using (is_active = true);
create policy "public_read_products" on products for select using (is_active = true);
create policy "public_read_images" on product_images for select using (true);
create policy "public_read_variants" on product_variants for select using (true);
create policy "public_read_reviews" on reviews for select using (is_approved = true);
create policy "public_read_shipping" on shipping_zones for select using (is_active = true);
create policy "public_read_settings" on site_settings for select using (true);

-- Les clientes peuvent créer une commande (checkout), mais pas la lire/modifier
-- (la lecture/gestion des commandes passe uniquement par la clé service_role,
-- utilisée côté serveur dans /app/api — jamais exposée au navigateur).
create policy "public_insert_orders" on orders for insert with check (true);
create policy "public_insert_order_items" on order_items for insert with check (true);
create policy "public_insert_reviews" on reviews for insert with check (is_approved = false);
create policy "public_insert_product_views" on product_views for insert with check (true);

-- Tout le reste (INSERT/UPDATE/DELETE sur produits, catégories, lecture des
-- commandes, etc.) est réservé au rôle service_role utilisé côté serveur
-- par l'espace admin — aucune policy "authenticated" supplémentaire n'est
-- nécessaire tant que l'admin passe par les routes /app/api du projet.

-- ============================================================
-- STORAGE : bucket pour les photos produits
-- ============================================================
-- À exécuter une seule fois (ou via l'interface Supabase Storage) :
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public_read_product_images_storage"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "authenticated_upload_product_images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ============================================================
-- DONNÉES DE DÉPART : catégories + frais de livraison
-- (Les 12 produits de démonstration sont déjà intégrés dans le code
-- du site — lib/demo-data.ts — et s'affichent automatiquement tant
-- qu'aucun produit n'existe encore dans Supabase. Vous pouvez aussi
-- les recopier ici si vous préférez les avoir en base dès le départ.)
-- ============================================================

insert into categories (slug, name_fr, name_ar, name_en, sort_order) values
  ('espadrilles', 'Les Espadrilles', 'إسبادريل', 'Espadrilles', 1),
  ('ballerines', 'Les Ballerines', 'باليرين', 'Ballet Flats', 2),
  ('talons', 'Les Talons', 'كعب عالي', 'Heels', 3),
  ('mocassins', 'Les Mocassins', 'موكاسان', 'Loafers', 4),
  ('sandales', 'Les Sandales', 'صنادل', 'Sandals', 5);

insert into shipping_zones (city_name, price, free_shipping_threshold) values
  ('Casablanca', 25, 500), ('Rabat', 25, 500), ('Kénitra', 25, 500),
  ('Marrakech', 35, 500), ('Fès', 35, 500), ('Tanger', 35, 500),
  ('Agadir', 40, 500), ('Oujda', 45, 500), ('Autre ville', 45, 500);

insert into site_settings (key, value_fr) values
  ('shop_name', 'Ladies Dress'),
  ('whatsapp_number', '212657134198'),
  ('phone_number', '0657134198'),
  ('banner_title', 'Des chaussures qui vous ressemblent'),
  ('banner_subtitle', 'Offre de lancement : -15% avec le code BIENVENUE15');

insert into promo_codes (code, discount_type, discount_value, min_order_amount) values
  ('BIENVENUE15', 'percent', 15, 0);
