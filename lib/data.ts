import { createServerSupabaseClient } from './supabase/server';
import { demoCategories, demoProducts, demoReviews, demoShippingZones } from './demo-data';
import { Category, Product, Review } from './types';

// Cette couche d'accès aux données essaie d'abord Supabase.
// Tant que les variables d'environnement Supabase ne sont pas renseignées
// (voir .env.example), le site fonctionne automatiquement avec les
// données de démonstration — pratique pour tester avant le déploiement.

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return demoCategories;

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error || !data || data.length === 0) return demoCategories;
  return data as Category[];
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return demoProducts;

  const { data, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('is_active', true);

  if (error || !data || data.length === 0) return demoProducts;
  return data as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return demoProducts.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .eq('slug', slug)
    .single();

  if (error || !data) return demoProducts.find((p) => p.slug === slug) ?? null;
  return data as unknown as Product;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getProducts();
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return products.filter((p) => p.category_id === category.id);
}

export async function getReviews(): Promise<Review[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return demoReviews;

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(9);

  if (error || !data || data.length === 0) return demoReviews;
  return data as Review[];
}

export async function getShippingZones() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return demoShippingZones;

  const { data, error } = await supabase
    .from('shipping_zones')
    .select('*')
    .eq('is_active', true);

  if (error || !data || data.length === 0) return demoShippingZones;
  return data;
}

export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + (v.is_active ? v.stock_quantity : 0), 0);
}

export function availableSizesForColor(product: Product, color: string): string[] {
  return product.variants
    .filter((v) => v.color_name === color && v.stock_quantity > 0 && v.is_active)
    .map((v) => v.size);
}

export function availableColors(product: Product): { name: string; hex: string }[] {
  const seen = new Map<string, string>();
  product.variants.forEach((v) => {
    if (!seen.has(v.color_name)) seen.set(v.color_name, v.color_hex);
  });
  return Array.from(seen.entries()).map(([name, hex]) => ({ name, hex }));
}
