import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateOrderNumber } from '@/lib/utils';

// Reçoit une commande depuis le tunnel d'achat.
// En production (Supabase configuré) : insère la commande + ses lignes,
// puis décrémente le stock de chaque variante commandée.
// Sans Supabase configuré : valide simplement les données et renvoie un
// numéro de commande, pour que le site reste testable en démo.
export async function POST(req: NextRequest) {
  const body = await req.json();

  const required = ['customer_name', 'phone', 'city', 'address', 'items', 'payment_method'];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Champ manquant: ${field}` }, { status: 400 });
    }
  }

  const orderNumber = generateOrderNumber();
  const supabase = createServerSupabaseClient(true);

  if (!supabase) {
    // Mode démo — pas de base de données connectée
    return NextResponse.json({ order_number: orderNumber, demo: true });
  }

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: body.customer_name,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      city: body.city,
      address: body.address,
      neighborhood: body.neighborhood || '',
      landmark: body.landmark || '',
      payment_method: body.payment_method,
      subtotal: body.subtotal,
      shipping_fee: body.shipping_fee,
      discount: body.discount || 0,
      total: body.total,
      promo_code: body.promo_code || null,
      comment: body.comment || '',
      status: 'nouvelle',
    })
    .select()
    .single();

  if (error || !order) {
    return NextResponse.json({ error: error?.message || 'Erreur serveur' }, { status: 500 });
  }

  const items = body.items.map((i: any) => ({
    order_id: order.id,
    product_id: i.productId,
    variant_id: i.variantId,
    product_name: i.name,
    color: i.color,
    size: i.size,
    price: i.price,
    quantity: i.quantity,
  }));

  await supabase.from('order_items').insert(items);

  if (body.promo_code) {
    const { data: promo } = await supabase.from('promo_codes').select('id, used_count').eq('code', body.promo_code).maybeSingle();
    if (promo) await supabase.from('promo_codes').update({ used_count: promo.used_count + 1 }).eq('id', promo.id);
  }

  // Le stock N'EST PAS décrémenté ici. Conformément au cahier des charges,
  // la commande arrive avec le statut "nouvelle" et le stock n'est réduit
  // que lorsque l'admin la fait passer au statut "Confirmée" — voir
  // /api/orders/[id] (PATCH), qui déclenche decrement_stock() à ce moment-là.

  return NextResponse.json({ order_number: orderNumber, demo: false });
}
