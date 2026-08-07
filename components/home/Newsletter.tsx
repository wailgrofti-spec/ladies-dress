import { getTranslations } from 'next-intl/server';
import { newsletterConfig } from '@/lib/home/newsletter';

export default async function Newsletter() {
  const t = await getTranslations('home');

  if (!newsletterConfig.enabled) return null;

  return (
    <section className="bg-rosegold-400 py-14">
      <div className="container-app text-center">
        <h2 className="font-display text-2xl font-semibold text-white">{t('newsletterTitle')}</h2>
        <p className="mt-2 text-sm text-white/90">{t('newsletterText')}</p>
        <form className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder={t('newsletterPlaceholder')}
            className="flex-1 rounded-full border-0 px-5 py-3 text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button type="submit" className="rounded-full bg-charcoal-800 px-6 py-3 text-sm font-semibold text-white hover:bg-charcoal-900">
            {t('newsletterCta')}
          </button>
        </form>
      </div>
    </section>
  );
}
