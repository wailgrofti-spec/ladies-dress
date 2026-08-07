import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';
import { Review } from '@/lib/types';

export default async function Testimonials({ reviews }: { reviews: Review[] }) {
  const t = await getTranslations('home');

  return (
    <section className="container-app py-14">
      <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('reviewsTitle')}</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex gap-0.5 text-gold-400">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-3 text-sm text-charcoal-700">{r.comment}</p>
            <p className="mt-3 text-xs font-semibold text-charcoal-800">{r.customer_name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
