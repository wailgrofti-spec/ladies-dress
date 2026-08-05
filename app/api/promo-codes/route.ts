import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ demo: true, promos: [] });

  const { data, error } = await supabase.from('promo_codes').select('*').order('code');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, promos: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : code promo non sauvegardé." });
  }

  const { data, error } = await supabase
    .from('promo_codes')
    .insert({
      code: body.code.toUpperCase(),
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      min_order_amount: body.min_order_amount || 0,
      usage_limit: body.usage_limit || null,
      used_count: 0,
      expires_at: body.expires_at || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, promo: data });
}
