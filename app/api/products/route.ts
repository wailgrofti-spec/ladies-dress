import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ demo: true, products: [] });

  const { data, error } = await supabase
    .from('products')
    .select('*, images:product_images(*), variants:product_variants(*)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, products: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({
      demo: true,
      message: "Supabase n'est pas configuré : ce produit ne sera pas sauvegardé. Configurez vos variables d'environnement pour activer la sauvegarde réelle.",
    });
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      category_id: body.category_id,
      slug: body.slug,
      name_fr: body.name_fr,
      name_ar: body.name_ar || body.name_fr,
      name_en: body.name_en || body.name_fr,
      description_fr: body.description_fr || '',
      description_ar: body.description_ar || '',
      description_en: body.description_en || '',
      material: body.material || '',
      brand: body.brand || '',
      weight_grams: body.weight_grams || null,
      sku: body.sku || null,
      price: body.price,
      old_price: body.old_price || null,
      is_new: !!body.is_new,
      is_bestseller: !!body.is_bestseller,
      is_active: body.status ? body.status === 'active' : true,
      status: body.status || 'active',
      meta_title: body.meta_title || '',
      meta_description: body.meta_description || '',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.variants?.length) {
    const variants = body.variants.map((v: any) => ({ ...v, product_id: data.id }));
    await supabase.from('product_variants').insert(variants);
  }
  if (body.images?.length) {
    const images = body.images.map((img: any, i: number) => ({ ...img, product_id: data.id, sort_order: i }));
    await supabase.from('product_images').insert(images);
  }

  return NextResponse.json({ demo: false, product: data });
}
