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
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FDF3F0 0%, #FCECE8 100%)',
          borderRadius: '1.25rem',
        }}
      >
        <div className="flex items-center justify-between min-h-[200px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[400px]">
          {/* Texte — gauche */}
          <div className="w-[50%] pl-4 pr-1 py-4 sm:pl-8 sm:py-8 md:pl-12 md:py-12 z-10 flex flex-col justify-center">
            <h1
              className="font-serif text-[#2E1B1B] font-bold leading-tight"
              style={{ fontSize: 'clamp(1.1rem, 4vw, 2.4rem)', lineHeight: 1.15 }}
            >
              {t('heroTitle')}
            </h1>
            <p
              className="mt-2 font-body text-[#3A2E2B]/80 max-w-[280px] sm:max-w-md"
              style={{ fontSize: 'clamp(0.6rem, 2vw, 0.9rem)', lineHeight: 1.35 }}
            >
              {t('heroSubtitle')}
            </p>

            {/* Boutons verticaux */}
            <div className="mt-4 flex flex-col gap-2 w-fit">
              <Link
                href={`/${locale}/boutique`}
                className="inline-flex w-fit items-center justify-center rounded-full px-3.5 py-1.5 text-[9.5px] sm:text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90"
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
                className="inline-flex w-fit items-center justify-center gap-1 rounded-full px-3.5 py-1.5 text-[9.5px] sm:text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90"
                style={{
                  background: '#25D366',
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('whatsappCta')}
              </a>
            </div>
          </div>

          {/* Image — droite */}
          <div className="w-[50%] relative self-stretch flex items-center justify-end">
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              className="object-contain object-right"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 600px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
