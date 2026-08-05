import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

// Endpoint public en lecture seule — sert les mêmes données que les pages
// boutique (Supabase si configuré, sinon données de démo). Utilisé par les
// composants client (favoris, recherche instantanée, produits consultés).
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}
