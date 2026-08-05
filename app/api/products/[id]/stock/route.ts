import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// POST : ajuste le stock d'une variante (+ ou -) et journalise le mouvement
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { variantId, change, reason } = await req.json();
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : ajustement non sauvegardé." });
  }

  const { data: variant, error: fetchError } = await supabase
    .from('product_variants')
    .select('stock_quantity')
    .eq('id', variantId)
    .single();
  if (fetchError || !variant) return NextResponse.json({ error: 'Variante introuvable' }, { status: 404 });

  const newStock = Math.max(0, variant.stock_quantity + change);
  const { error: updateError } = await supabase
    .from('product_variants')
    .update({ stock_quantity: newStock })
    .eq('id', variantId);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  await supabase.from('stock_movements').insert({
    variant_id: variantId,
    product_id: params.id,
    change,
    reason: reason || 'manuel',
  });

  return NextResponse.json({ demo: false, newStock });
}

// GET : historique des mouvements de stock d'un produit
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ demo: true, movements: [] });

  const { data, error } = await supabase
    .from('stock_movements')
    .select('*')
    .eq('product_id', params.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, movements: data });
}
