import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();
  const supabase = createServerSupabaseClient(true);

  if (!supabase) {
    // Mode démo : seul le code de lancement fonctionne, pour rester testable
    if (code?.toUpperCase() === 'BIENVENUE15') {
      return NextResponse.json({ valid: true, demo: true, discount_type: 'percent', discount_value: 15 });
    }
    return NextResponse.json({ valid: false, message: "Supabase n'est pas configuré : seul le code BIENVENUE15 fonctionne en mode démo." });
  }

  const { data: promo, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', String(code).toUpperCase())
    .eq('is_active', true)
    .maybeSingle();

  if (error) return NextResponse.json({ valid: false, message: 'Erreur serveur' }, { status: 500 });
  if (!promo) return NextResponse.json({ valid: false, message: 'Code promo invalide ou inactif.' });

  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, message: 'Ce code promo a expiré.' });
  }
  if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
    return NextResponse.json({ valid: false, message: "Ce code promo a atteint sa limite d'utilisation." });
  }
  if (promo.min_order_amount && subtotal < promo.min_order_amount) {
    return NextResponse.json({ valid: false, message: `Ce code nécessite un minimum de ${promo.min_order_amount} DH d'achat.` });
  }

  return NextResponse.json({
    valid: true,
    demo: false,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
  });
}
