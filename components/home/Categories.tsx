import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ChevronRight } from 'lucide-react';
import { homeCategories } from '@/lib/home/categories';
import ImageWithFallback from '@/components/ImageWithFallback';

export default async function Categories({ locale }: { locale: string }) {
  const t = await getTranslations('home');
  const tCat = await getTranslations('categories');

  const categoryLabel = (slug: string) => {
    try {
      return tCat(slug as any);
    } catch {
      return slug;
    }
  };

  // On affiche seulement les 4 premières catégories sur la home (grille 2×2)
  const displayed = homeCategories.slice(0, 4);

  return (
    <section className="px-4 py-5 sm:px-6 lg:px-8">
      {/* Titre + Voir tout */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-display text-[#2E1B1B]"
          style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 700 }}
        >
          {t('categoriesTitle')}
        </h2>
        <Link
          href={`/${locale}/boutique`}
          className="flex items-center gap-0.5 font-body text-sm font-semibold transition-colors hover:opacity-80"
          style={{ color: '#C98374', fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)' }}
        >
          {t('viewAll')} →
        </Link>
      </div>

      {/* Grille 2 colonnes fixe sur mobile, 4 colonnes sur desktop */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {displayed.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/boutique/${c.slug}`}
            className="group block overflow-hidden transition-shadow hover:shadow-lg"
            style={{
              borderRadius: '1.1rem',
              background: '#fff',
              boxShadow: '0 2px 12px -2px rgba(46,27,27,0.08)',
            }}
          >
            {/* Image */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
              <ImageWithFallback
                src={c.image_url ?? ''}
                alt={c.name_fr}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 48vw, 25vw"
              />
            </div>

            {/* Nom + flèche */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <p
                className="font-body font-medium text-[#2E1B1B] leading-tight"
                style={{ fontSize: 'clamp(0.75rem, 2.8vw, 0.875rem)' }}
              >
                {categoryLabel(c.slug)}
              </p>
              {/* Flèche dans un cercle — signature du design de référence */}
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors group-hover:bg-[#C98374] group-hover:text-white"
                style={{
                  border: '1.5px solid #C98374',
                  color: '#C98374',
                }}
              >
                <ChevronRight size={13} strokeWidth={2.5} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
