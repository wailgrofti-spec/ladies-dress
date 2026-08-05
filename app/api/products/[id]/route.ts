import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Champs propres à la table `products` — tout le reste (variants, images)
// est synchronisé séparément dans leurs propres tables.
const PRODUCT_COLUMNS = [
  'category_id', 'slug', 'name_fr', 'name_ar', 'name_en',
  'description_fr', 'description_ar', 'description_en',
  'material', 'brand', 'weight_grams', 'sku',
  'price', 'old_price', 'is_new', 'is_bestseller', 'is_active', 'status',
  'meta_title', 'meta_description',
];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : modification non sauvegardée." });
  }

  const productPayload: Record<string, any> = {};
  PRODUCT_COLUMNS.forEach((col) => {
    if (body[col] !== undefined) productPayload[col] = body[col];
  });
  productPayload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('products')
    .update(productPayload)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Resynchronise les variantes (couleur x pointure) si fournies :
  // on remplace l'ensemble pour rester simple et cohérent avec le formulaire.
  if (Array.isArray(body.variants)) {
    await supabase.from('product_variants').delete().eq('product_id', params.id);
    if (body.variants.length > 0) {
      const variants = body.variants.map((v: any) => ({ ...v, product_id: params.id }));
      await supabase.from('product_variants').insert(variants);
    }
  }

  // Resynchronise les images si fournies
  if (Array.isArray(body.images)) {
    await supabase.from('product_images').delete().eq('product_id', params.id);
    if (body.images.length > 0) {
      const images = body.images.map((img: any, i: number) => ({ ...img, product_id: params.id, sort_order: i }));
      await supabase.from('product_images').insert(images);
    }
  }

  return NextResponse.json({ demo: false, product: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : suppression non effectuée." });
  }

  const mode = req.nextUrl.searchParams.get('mode'); // 'archive' | 'permanent'

  if (mode === 'archive') {
    const { error } = await supabase.from('products').update({ status: 'archived', is_active: false }).eq('id', params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ demo: false, archived: true });
  }

  const { error } = await supabase.from('products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, success: true });
}
