import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : catégorie non sauvegardée." });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      slug: body.slug,
      name_fr: body.name_fr,
      name_ar: body.name_ar || body.name_fr,
      name_en: body.name_en || body.name_fr,
      image_url: body.image_url || null,
      is_active: true,
      sort_order: body.sort_order || 99,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, category: data });
}
