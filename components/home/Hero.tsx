import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { heroImage } from '@/lib/home/hero';
import { buildWhatsappLink } from '@/lib/whatsapp';

/*
 * Hero.tsx — page d'accueil
 *
 * Stratégie image :
 *   - On utilise un <img> standard (pas Next/Image fill) avec height:100% et
 *     width:auto pour préserver EXACTEMENT le ratio de hero-banner.jpg (1533x1026)
 *     et afficher toute la composition (chaussures + logo LD + satin + socle)
 *     sans aucun recadrage.
 *   - L'image est positionnée en absolute right:0 top:0 bottom:0 pour coller
 *     bord à bord sur la droite.
 *   - overflow:hidden sur le parent coupe uniquement le surplus éventuel à gauche
 *     de l'image (zone de fond vide), jamais les chaussures ni le logo LD.
 *
 * Couleur de fond :
 *   - #FAE0DA correspond précisément au fond de hero-banner.jpg.
 *   - Identique pour FR / EN / AR — aucune différence entre les langues.
 */

const BG = '#FAE0DA'; // Correspond exactement au fond de hero-banner.jpg

export default async function Hero({ locale }: { locale: string }) {
  const t = await getTranslations('home');
  const isRtl = locale === 'ar';

  return (
    <section className="px-3 pt-4 pb-2 sm:px-6 lg:px-8">
      <div
        className="relative overflow-hidden"
        style={{
          background: BG,
          borderRadius: '1.25rem',
          minHeight: '210px',
        }}
      >
        {/*
         * IMAGE — positionnée en absolute sur le côté opposé au texte :
         *   - LTR (FR / EN) : droite
         *   - RTL (AR)       : gauche
         *
         * height:100% + width:auto = image à son ratio naturel, jamais coupée
         * sur les zones importantes (logo LD, chaussures, satin).
         */}
        <div
          className="absolute top-0 bottom-0 overflow-hidden"
          style={{
            [isRtl ? 'left' : 'right']: 0,
            // Largeur max pour que l'image n'écrase pas le texte sur petit écran
            // L'image est plus large que haute (1533/1026 ≈ 1.49), donc si
            // minHeight = 210px ➜ largeur naturelle ≈ 313px.
            // On laisse l'image décider de sa largeur via width:auto.
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage.url}
            alt={heroImage.alt}
            style={{
              height: '100%',
              width: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/*
         * TEXTE + BOUTONS — superposés à gauche (ou droite en RTL) via z-10.
         * Largeur fixée à 48 % pour laisser la place à l'image.
         */}
        <div
          className="relative z-10 flex flex-col justify-between py-5 sm:py-8 md:py-12"
          style={{
            width: '47%',
            minHeight: '210px',
            paddingLeft: isRtl ? '0' : '1rem',
            paddingRight: isRtl ? '1rem' : '0',
            ...(isRtl ? { marginLeft: 'auto' } : {}),
          }}
        >
          {/* Titre */}
          <div>
            <h1
              className="font-serif text-[#2E1B1B] font-bold"
              style={{
                fontSize: 'clamp(1.2rem, 5vw, 2.8rem)',
                lineHeight: 1.1,
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {t('heroTitle')}
            </h1>
            <p
              className="mt-3 font-body text-[#3A2E2B]/75"
              style={{
                fontSize: 'clamp(0.68rem, 2.2vw, 0.92rem)',
                lineHeight: 1.4,
                textAlign: isRtl ? 'right' : 'left',
              }}
            >
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Boutons */}
          <div className="mt-5 flex flex-col gap-2.5">
            {/* Bouton Collection */}
            <Link
              href={`/${locale}/boutique`}
              className="flex items-center justify-center rounded-full font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: '#C98374',
                height: '36px',
                fontSize: 'clamp(0.65rem, 2.1vw, 0.82rem)',
                paddingLeft: '14px',
                paddingRight: '14px',
                width: '100%',
                whiteSpace: 'nowrap',
              }}
            >
              {t('heroCta')}
            </Link>

            {/* Bouton WhatsApp */}
            <a
              href={buildWhatsappLink(
                locale === 'ar'
                  ? 'مرحبا Ladies Dress 👋، أريد تقديم طلب.'
                  : locale === 'en'
                  ? 'Hello Ladies Dress 👋, I would like to place an order.'
                  : 'Bonjour Ladies Dress 👋, je souhaite passer une commande.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-full font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: '#25D366',
                height: '36px',
                fontSize: 'clamp(0.65rem, 2.1vw, 0.82rem)',
                paddingLeft: '14px',
                paddingRight: '14px',
                width: '100%',
                whiteSpace: 'nowrap',
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
                aria-hidden="true"
              >
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
