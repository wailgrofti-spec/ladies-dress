import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ demo: true, settings: {} });

  const { data, error } = await supabase.from('site_settings').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, any> = {};
  data?.forEach((row) => {
    settings[row.key] = { fr: row.value_fr, ar: row.value_ar, en: row.value_en };
  });
  return NextResponse.json({ demo: false, settings });
}

export async function POST(req: NextRequest) {
  const body = await req.json(); // { key, value_fr, value_ar?, value_en? }
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : paramètre non sauvegardé." });
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert({ key: body.key, value_fr: body.value_fr, value_ar: body.value_ar || '', value_en: body.value_en || '' }, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, success: true });
}
