import { getTranslations } from 'next-intl/server';
import { Product } from '@/lib/types';
import { getNewArrivals } from '@/lib/home/new-arrivals';
import ProductCard from '@/components/ProductCard';

export default async function NewArrivals({ products }: { products: Product[] }) {
  const t = await getTranslations('home');
  const newArrivals = getNewArrivals(products);

  if (newArrivals.length === 0) return null;

  return (
    <section className="container-app py-8">
      <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('newArrivals')}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {newArrivals.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
