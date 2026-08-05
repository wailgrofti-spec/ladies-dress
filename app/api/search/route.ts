import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getCategories } from '@/lib/data';

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').trim().toLowerCase();
  if (!q) return NextResponse.json({ results: [] });

  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const results = products.filter((p) => {
    const category = categories.find((c) => c.id === p.category_id);
    const haystacks = [
      p.name_fr, p.name_ar, p.name_en,
      category?.name_fr, category?.name_en,
      p.price.toString(),
      ...p.variants.map((v) => v.color_name),
      ...p.variants.map((v) => v.size),
    ]
      .filter(Boolean)
      .map((s) => String(s).toLowerCase());

    return haystacks.some((h) => h.includes(q));
  });

  return NextResponse.json({ results: results.slice(0, 8) });
}
