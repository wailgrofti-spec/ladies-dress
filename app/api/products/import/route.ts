import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';

interface ImportRow {
  sku?: string;
  name_fr: string;
  name_ar?: string;
  name_en?: string;
  category_slug?: string;
  brand?: string;
  material?: string;
  price: number;
  old_price?: number;
  weight_grams?: number;
}

// Import en masse : chaque ligne est upsertée par SKU (créée si le SKU
// n'existe pas encore, mise à jour sinon). Les variantes (couleurs/pointures)
// ne sont pas importées via ce canal — elles se gèrent depuis la fiche
// produit une fois le produit créé, pour éviter un format de fichier trop
// complexe à préparer côté boutique.
export async function POST(req: NextRequest) {
  const { rows } = (await req.json()) as { rows: ImportRow[] };
  const supabase = createServerSupabaseClient(true);

  if (!supabase) {
    return NextResponse.json({
      demo: true,
      message: "Supabase n'est pas configuré : l'import n'a pas été sauvegardé.",
      imported: 0,
    });
  }

  const { data: categories } = await supabase.from('categories').select('id, slug');

  let imported = 0;
  const errors: string[] = [];

  for (const row of rows) {
    if (!row.name_fr || !row.price) {
      errors.push(`Ligne ignorée (nom ou prix manquant) : ${JSON.stringify(row)}`);
      continue;
    }

    const category = categories?.find((c) => c.slug === row.category_slug);
    const payload = {
      name_fr: row.name_fr,
      name_ar: row.name_ar || row.name_fr,
      name_en: row.name_en || row.name_fr,
      category_id: category?.id ?? null,
      brand: row.brand || '',
      material: row.material || '',
      price: Number(row.price),
      old_price: row.old_price ? Number(row.old_price) : null,
      weight_grams: row.weight_grams ? Number(row.weight_grams) : null,
      sku: row.sku || null,
      slug: slugify(row.name_fr),
      is_active: true,
      status: 'active',
    };

    if (row.sku) {
      const { data: existing } = await supabase.from('products').select('id').eq('sku', row.sku).maybeSingle();
      if (existing) {
        await supabase.from('products').update(payload).eq('id', existing.id);
        imported++;
        continue;
      }
    }

    const { error } = await supabase.from('products').insert(payload);
    if (error) errors.push(`${row.name_fr} : ${error.message}`);
    else imported++;
  }

  return NextResponse.json({ demo: false, imported, errors });
}
