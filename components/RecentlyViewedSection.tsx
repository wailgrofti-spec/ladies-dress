'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRecentlyViewed } from '@/lib/recently-viewed-context';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

export default function RecentlyViewedSection({ excludeSlug }: { excludeSlug?: string }) {
  const { slugs } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);

  const relevantSlugs = slugs.filter((s) => s !== excludeSlug);

  useEffect(() => {
    if (relevantSlugs.length === 0) return;
    fetch('/api/products/public')
      .then((r) => r.json())
      .then((data) => {
        const found = relevantSlugs
          .map((slug) => data.products.find((p: Product) => p.slug === slug))
          .filter(Boolean)
          .slice(0, 4);
        setProducts(found);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs.join(',')]);

  if (products.length === 0) return null;

  return (
    <section className="container-app pb-14">
      <h2 className="font-display text-2xl font-semibold text-charcoal-900">Récemment consultés</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
