import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MessageCircle } from 'lucide-react';
import { heroImage } from '@/lib/home/hero';
import { buildWhatsappLink } from '@/lib/whatsapp';

export default async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations('home');

  return (
    <section className="container-app pt-4">
      <div className="overflow-hidden rounded-soft bg-blush-100">
        <div className="grid items-center gap-6 p-6 md:grid-cols-2 md:gap-10 md:p-12">
          <div className="order-2 md:order-1">
            <h1 className="font-display text-3xl font-semibold leading-tight text-charcoal-900 sm:text-4xl md:text-5xl">
              {t('heroTitle')}
            </h1>
            <p className="mt-3 text-sm text-charcoal-700 sm:text-base">{t('heroSubtitle')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/boutique`} className="btn-primary">
                {t('heroCta')}
              </Link>
              <a
                href={buildWhatsappLink('Bonjour Ladies Dress 👋, je souhaite passer une commande.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle size={18} /> {t('whatsappCta')}
              </a>
            </div>
          </div>
          <div className="order-1 aspect-[4/3] overflow-hidden rounded-soft md:order-2">
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              width={900}
              height={675}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
