import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : ville non sauvegardée." });

  const { data, error } = await supabase
    .from('shipping_zones')
    .insert({
      city_name: body.city_name,
      price: Number(body.price),
      is_active: true,
      free_shipping_threshold: body.free_shipping_threshold ?? 500,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, zone: data });
}
