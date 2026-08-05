import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : modification non sauvegardée." });

  const { data, error } = await supabase.from('promo_codes').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, promo: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : suppression non effectuée." });

  const { error } = await supabase.from('promo_codes').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, success: true });
}
