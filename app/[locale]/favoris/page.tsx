'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const locale = useLocale();
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products/public')
      .then((r) => r.json())
      .then((data) => setProducts(data.products.filter((p: Product) => ids.includes(p.id))))
      .finally(() => setLoading(false));
  }, [ids]);

  return (
    <div className="container-app py-8">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-charcoal-900">
        <Heart className="text-rosegold-500" /> Mes favoris
      </h1>

      {!loading && products.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-charcoal-700">Vous n'avez pas encore ajouté de favoris.</p>
          <Link href={`/${locale}/boutique`} className="btn-primary mt-4 inline-flex">
            Découvrir la boutique
          </Link>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
