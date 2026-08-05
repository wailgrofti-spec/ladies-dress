import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { product_id } = await req.json();
  const supabase = createServerSupabaseClient();
  if (!supabase || !product_id) return NextResponse.json({ demo: true });

  await supabase.from('product_views').insert({ product_id });
  return NextResponse.json({ success: true });
}
