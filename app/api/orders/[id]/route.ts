import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const FULFILLING_STATUSES = ['confirmee', 'en_preparation', 'expediee', 'livree'];
const REVERSING_STATUSES = ['annulee', 'refusee', 'retournee'];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json(); // { status?, admin_notes? }
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : statut non sauvegardé." });
  }

  // On lit l'état actuel de la commande pour décider si le stock doit être
  // décrémenté (première confirmation) ou restitué (annulation d'une
  // commande déjà confirmée) — jamais les deux fois de suite.
  const { data: current, error: fetchError } = await supabase
    .from('orders')
    .select('status, stock_decremented, items:order_items(variant_id, quantity)')
    .eq('id', params.id)
    .single();

  if (fetchError || !current) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

  const updatePayload: Record<string, any> = { ...body, updated_at: new Date().toISOString() };
  let stockNote: string | null = null;

  if (body.status && FULFILLING_STATUSES.includes(body.status) && !current.stock_decremented) {
    for (const item of current.items as { variant_id: string; quantity: number }[]) {
      await supabase.rpc('decrement_stock', { variant_id: item.variant_id, qty: item.quantity });
    }
    updatePayload.stock_decremented = true;
    stockNote = 'Stock décrémenté (commande confirmée).';
  } else if (body.status && REVERSING_STATUSES.includes(body.status) && current.stock_decremented) {
    for (const item of current.items as { variant_id: string; quantity: number }[]) {
      await supabase.rpc('increment_stock', { variant_id: item.variant_id, qty: item.quantity, reason: 'annulation' });
    }
    updatePayload.stock_decremented = false;
    stockNote = 'Stock restitué (commande annulée/refusée/retournée après confirmation).';
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, order: data, stockNote });
}
