import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { heroImage } from '@/lib/home/hero';
import { buildWhatsappLink } from '@/lib/whatsapp';

export default async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations('home');

  return (
    <section className="px-3 pt-4 pb-2 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden bg-[#FDF0EE]"
        style={{
          borderRadius: '1.25rem',
          minHeight: '230px',
        }}
      >
        {/* Layout mobile : flex row (texte gauche, image droite sans coupure) */}
        <div className="flex h-full items-center justify-between">
          {/* Texte — gauche */}
          <div className="relative z-10 flex-1 px-5 py-6 pr-0 w-[55%]">
            <h1
              className="font-serif text-[#2E1B1B] leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 6vw, 2.8rem)', fontWeight: 600, lineHeight: 1.15 }}
            >
              {t('heroTitle')}
            </h1>
            <p
              className="mt-2 font-body text-[#3A2E2B]/80"
              style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.9rem)', lineHeight: 1.4 }}
            >
              {t('heroSubtitle')}
            </p>

            {/* Boutons */}
            <div className="mt-4 flex flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap">
              <Link
                href={`/${locale}/boutique`}
                className="inline-flex w-fit items-center justify-center rounded-full px-4 py-2 text-[10.5px] font-semibold text-white shadow-sm transition-all hover:opacity-90"
                style={{
                  background: '#C98374',
                }}
              >
                {t('heroCta')}
              </Link>
              <a
                href={buildWhatsappLink('Bonjour Ladies Dress 👋, je souhaite passer une commande.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[10.5px] font-semibold text-white shadow-sm transition-all hover:opacity-90"
                style={{
                  background: '#25D366',
                }}
              >
                {/* Icône WhatsApp SVG inline pour éviter tout import supplémentaire */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('whatsappCta')}
              </a>
            </div>
          </div>

          {/* Image — droite en absolute cover avec object-contain */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] z-0 flex items-center justify-end">
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              className="object-contain object-right"
              sizes="(max-width: 640px) 55vw, (max-width: 1024px) 50vw, 400px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
