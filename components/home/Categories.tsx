import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
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

  return (
    <section className="container-app py-12">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('categoriesTitle')}</h2>
        <Link href={`/${locale}/boutique`} className="flex items-center gap-1 text-sm font-medium text-rosegold-500 hover:text-rosegold-600">
          {t('viewAll')} <ArrowRight size={16} className="rtl:rotate-180" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {homeCategories.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/boutique/${c.slug}`}
            className="group block overflow-hidden rounded-soft bg-white shadow-card transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <ImageWithFallback
                src={c.image_url ?? ''}
                alt={c.name_fr}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
            </div>
            <div className="flex items-center justify-between px-3 py-3">
              <p className="text-sm font-medium text-charcoal-800">{categoryLabel(c.slug)}</p>
              <ArrowRight size={16} className="shrink-0 text-rosegold-400 rtl:rotate-180" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
