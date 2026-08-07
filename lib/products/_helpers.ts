import { Product } from '../types';

// Images placeholder libres de droit (Unsplash) — à remplacer depuis /admin
// par les vraies photos produits une fois disponibles.
export const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=80`;

export const SIZES = ['36', '37', '38', '39', '40', '41'];

// Nombre total de produits de démonstration, toutes catégories confondues.
// Utilisé uniquement pour répartir des dates de création variées et
// réalistes entre les produits (voir buildProduct ci-dessous).
export const TOTAL_DEMO_PRODUCTS = 12;

export function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

export function makeVariants(productId: string, colors: { name: string; hex: string }[]): Product['variants'] {
  const variants: Product['variants'] = [];
  colors.forEach((c, ci) => {
    SIZES.forEach((s, si) => {
      variants.push({
        id: `${productId}-v-${ci}-${si}`,
        product_id: productId,
        color_name: c.name,
        color_hex: c.hex,
        size: s,
        sku: `${productId.toUpperCase()}-${c.name.slice(0, 3).toUpperCase()}-${s}`,
        stock_quantity: (ci + si) % 4, // varie le stock, certaines tailles à 0
        is_active: true,
      });
    });
  });
  return variants;
}

export function makeImages(productId: string, seeds: string[]): Product['images'] {
  return seeds.map((seed, i) => ({
    id: `${productId}-img-${i}`,
    product_id: productId,
    url: img(seed),
    alt_text_fr: 'Photo produit',
    alt_text_ar: 'صورة المنتج',
    alt_text_en: 'Product photo',
    sort_order: i,
    is_primary: i === 0,
  }));
}

export interface ProductSeed {
  id: string;
  slug: string;
  category_id: string;
  name_fr: string; name_ar: string; name_en: string;
  desc_fr: string; desc_ar: string; desc_en: string;
  material: string;
  price: number;
  old_price?: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  colors: { name: string; hex: string }[];
  imageSeeds: string[];
}

// Construit un produit complet (fiche + variantes + images) à partir d'une
// définition courte. `globalIndex` est la position du produit dans
// l'ensemble du catalogue de démo (0-based), utilisée uniquement pour
// varier le poids et la date de création afin que les données paraissent
// réalistes (rien de tout ça n'affecte le comportement du site).
export function buildProduct(seed: ProductSeed, globalIndex: number): Product {
  return {
    id: seed.id,
    category_id: seed.category_id,
    slug: seed.slug,
    name_fr: seed.name_fr,
    name_ar: seed.name_ar,
    name_en: seed.name_en,
    description_fr: seed.desc_fr,
    description_ar: seed.desc_ar,
    description_en: seed.desc_en,
    material: seed.material,
    brand: 'Ladies Dress',
    weight_grams: 350 + globalIndex * 10,
    sku: `LD-${seed.id.toUpperCase()}`,
    price: seed.price,
    old_price: seed.old_price ?? null,
    is_new: !!seed.is_new,
    is_bestseller: !!seed.is_bestseller,
    is_active: true,
    status: 'active',
    meta_title: `${seed.name_fr} — Ladies Dress`,
    meta_description: seed.desc_fr.slice(0, 150),
    created_at: daysAgo(TOTAL_DEMO_PRODUCTS - globalIndex),
    images: makeImages(seed.id, seed.imageSeeds),
    variants: makeVariants(seed.id, seed.colors),
  };
}
