import { getTranslations } from 'next-intl/server';
import { serviceIcons } from '@/lib/home/services';

export default async function Services() {
  const t = await getTranslations('home');
  const whyItems = t.raw('whyUsItems') as { title: string; text: string }[];

  return (
    <section className="bg-white py-14">
      <div className="container-app">
        <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('whyUs')}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {whyItems.map((item, i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            return (
              <div key={item.title} className="rounded-soft bg-blush-50 p-5">
                <Icon className="text-rosegold-400" size={26} />
                <p className="mt-3 font-semibold text-charcoal-800">{item.title}</p>
                <p className="mt-1 text-sm text-charcoal-700">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
