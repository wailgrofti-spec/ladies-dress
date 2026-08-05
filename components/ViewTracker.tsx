'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/lib/recently-viewed-context';

export default function ViewTracker({ productId, slug }: { productId: string; slug: string }) {
  const { addView } = useRecentlyViewed();

  useEffect(() => {
    addView(slug);
    fetch('/api/product-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, slug]);

  return null;
}
