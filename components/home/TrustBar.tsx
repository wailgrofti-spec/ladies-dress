import { getTranslations } from 'next-intl/server';
import { Truck, Wallet, MapPin } from 'lucide-react';

export default async function TrustBar() {
  const t = await getTranslations('home.trustBar');

  const items = [
    { icon: Truck,   title: t('delivery.title'),   subtitle: t('delivery.subtitle') },
    { icon: Wallet,  title: t('cod.title'),         subtitle: t('cod.subtitle') },
    { icon: MapPin,  title: t('nationwide.title'),  subtitle: t('nationwide.subtitle') },
  ];

  return (
    <section className="px-3 py-3 sm:px-6 lg:px-8">
      <div
        className="grid grid-cols-3"
        style={{
          background: '#FCECE9',
          borderRadius: '1.25rem',
        }}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex flex-col items-center gap-1 px-1.5 py-3.5 text-center"
              style={i > 0 ? { borderLeft: '1px solid rgba(234, 200, 192, 0.4)' } : {}}
            >
              <Icon size={18} strokeWidth={1.25} className="shrink-0" style={{ color: '#C98374' }} />
              <div>
                <p
                  className="font-body font-semibold text-[#2E1B1B] leading-tight"
                  style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.75rem)' }}
                >
                  {item.title}
                </p>
                <p
                  className="font-body text-[#6B4040]/70 leading-tight mt-0.5"
                  style={{ fontSize: 'clamp(0.55rem, 2vw, 0.65rem)' }}
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
