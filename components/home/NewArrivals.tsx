import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Product } from '@/lib/types';
import { getNewArrivals } from '@/lib/home/new-arrivals';
import HomeProductCard from '@/components/home/HomeProductCard';

export default async function NewArrivals({
  products,
  locale,
}: {
  products: Product[];
  locale: string;
}) {
  const t = await getTranslations('home');
  const newArrivals = getNewArrivals(products);

  if (newArrivals.length === 0) return null;

  return (
    <section className="px-4 py-5 sm:px-6 lg:px-8">
      {/* Titre + Voir tout */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-display text-[#2E1B1B]"
          style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 700 }}
        >
          {t('newArrivals')}
        </h2>
        <Link
          href={`/${locale}/boutique`}
          className="font-body text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: '#C98374', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}
        >
          {t('viewAll')} →
        </Link>
      </div>

      {/* Grille 2 colonnes sur mobile, 4 sur desktop */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {newArrivals.map((p) => (
          <HomeProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
