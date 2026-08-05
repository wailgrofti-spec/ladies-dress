// Types partagés — reflètent le schéma SQL (voir /supabase/schema.sql)

export type Locale = 'fr' | 'ar' | 'en';

export interface Category {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string;
  color_image_url?: string | null;
  size: string; // ex: "37"
  sku?: string;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text_fr: string;
  alt_text_ar: string;
  alt_text_en: string;
  sort_order: number;
  is_primary: boolean;
}

export type ProductStatus = 'active' | 'hidden' | 'archived';

export interface Product {
  id: string;
  category_id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  material: string;
  brand?: string;
  weight_grams?: number | null;
  sku?: string;
  price: number;
  old_price: number | null;
  is_new: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  status?: ProductStatus;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: Category;
}

export interface StockMovement {
  id: string;
  variant_id: string;
  product_id: string;
  change: number;
  reason: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string | null;
  customer_name: string;
  rating: number; // 1-5
  comment: string;
  photos?: string[];
  is_approved: boolean;
  created_at: string;
}

export type OrderStatus =
  | 'nouvelle'
  | 'a_confirmer'
  | 'confirmee'
  | 'en_preparation'
  | 'expediee'
  | 'livree'
  | 'annulee'
  | 'refusee'
  | 'retournee';

export type PaymentMethod = 'cod' | 'online' | 'bank_transfer';

export interface OrderItem {
  product_id: string;
  variant_id: string;
  product_name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  neighborhood: string;
  landmark?: string;
  payment_method: PaymentMethod;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  promo_code?: string;
  comment?: string;
  status: OrderStatus;
  admin_notes?: string;
  items: OrderItem[];
  created_at: string;
}

export interface ShippingZone {
  id: string;
  city_name: string;
  price: number;
  is_active: boolean;
  free_shipping_threshold: number | null;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
}

// Panier — stocké côté client (localStorage)
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  variantId: string;
}
