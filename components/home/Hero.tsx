import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { heroImage } from '@/lib/home/hero';
import { buildWhatsappLink } from '@/lib/whatsapp';

export default async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations('home');

  return (
    <section className="px-3 pt-4 pb-2 sm:px-6 lg:px-8">
      {/*
        Le fond du Hero (#FDE8E3) doit correspondre le plus possible au fond
        de hero-banner.jpg pour que l'image se fonde sans rectangle visible.
      */}
      <div
        className="relative overflow-hidden"
        style={{
          background: '#FDE8E3',
          borderRadius: '1.25rem',
          minHeight: '220px',
        }}
      >
        {/* ── IMAGE occupe la moitié droite, bord à bord ── */}
        <div className="absolute right-0 top-0 bottom-0 w-[58%] sm:w-[55%]">
          <Image
            src={heroImage.url}
            alt={heroImage.alt}
            fill
            className="object-cover object-left-top"
            sizes="(max-width: 640px) 58vw, (max-width: 1024px) 55vw, 700px"
            priority
          />
        </div>

        {/* ── TEXTE + BOUTONS à gauche, au-dessus de l'image ── */}
        <div className="relative z-10 flex flex-col justify-between w-[48%] px-4 py-5 sm:px-7 sm:py-8 md:px-10 md:py-12"
          style={{ minHeight: '220px' }}
        >
          {/* Titre */}
          <div>
            <h1
              className="font-serif text-[#2E1B1B] font-bold"
              style={{ fontSize: 'clamp(1.25rem, 5vw, 2.6rem)', lineHeight: 1.1 }}
            >
              {t('heroTitle')}
            </h1>
            <p
              className="mt-3 font-body text-[#3A2E2B]/75"
              style={{ fontSize: 'clamp(0.7rem, 2.2vw, 0.95rem)', lineHeight: 1.4 }}
            >
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Boutons */}
          <div className="mt-5 flex flex-col gap-2.5">
            {/* Bouton Collection */}
            <Link
              href={`/${locale}/boutique`}
              className="flex items-center justify-center rounded-full font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: '#C98374',
                height: '36px',
                fontSize: 'clamp(0.65rem, 2vw, 0.8rem)',
                paddingLeft: '16px',
                paddingRight: '16px',
                width: '100%',
              }}
            >
              {t('heroCta')}
            </Link>

            {/* Bouton WhatsApp */}
            <a
              href={buildWhatsappLink('Bonjour Ladies Dress 👋, je souhaite passer une commande.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-full font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: '#25D366',
                height: '36px',
                fontSize: 'clamp(0.65rem, 2vw, 0.8rem)',
                paddingLeft: '16px',
                paddingRight: '16px',
                width: '100%',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('whatsappCta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
