import { getTranslations } from 'next-intl/server';
import { Truck, Wallet, MapPin } from 'lucide-react';

export default async function TrustBar() {
  const t = await getTranslations('home.trustBar');

  const items = [
    { icon: Truck, title: t('delivery.title'), subtitle: t('delivery.subtitle') },
    { icon: Wallet, title: t('cod.title'), subtitle: t('cod.subtitle') },
    { icon: MapPin, title: t('nationwide.title'), subtitle: t('nationwide.subtitle') },
  ];

  return (
    <section className="container-app py-6">
      <div className="grid grid-cols-1 gap-3 rounded-soft bg-white p-4 shadow-card sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-blush-200 rtl:sm:divide-x-reverse">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-3 px-2 sm:px-4">
              <Icon size={22} className="shrink-0 text-rosegold-400" />
              <div>
                <p className="text-sm font-semibold text-charcoal-800">{item.title}</p>
                <p className="text-xs text-charcoal-700">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
