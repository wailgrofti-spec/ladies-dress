import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { demoReviews } from '@/lib/demo-data';

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('product_id');
  const pendingOnly = req.nextUrl.searchParams.get('pending') === 'true';

  const supabase = createServerSupabaseClient(pendingOnly); // service role needed to see unapproved reviews
  if (!supabase) {
    const filtered = productId ? demoReviews.filter((r) => r.product_id === productId) : demoReviews;
    return NextResponse.json({ demo: true, reviews: filtered });
  }

  let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (productId) query = query.eq('product_id', productId);
  query = pendingOnly ? query.eq('is_approved', false) : query.eq('is_approved', true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, reviews: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json(); // { product_id, customer_name, rating, comment, photos? }
  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ demo: true, message: "Supabase n'est pas configuré : avis non sauvegardé (mais merci !)." });
  }

  const { error } = await supabase.from('reviews').insert({
    product_id: body.product_id || null,
    customer_name: body.customer_name,
    rating: body.rating,
    comment: body.comment || '',
    photos: body.photos || [],
    is_approved: false, // modéré par l'admin avant publication
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ demo: false, success: true });
}
