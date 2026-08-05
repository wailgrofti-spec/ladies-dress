import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json(); // { is_approved: boolean }
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré." });

  const { error } = await supabase.from('reviews').update(body).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré." });

  const { error } = await supabase.from('reviews').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, success: true });
}
