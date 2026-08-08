'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { totalStock, availableColors } from '@/lib/data';
import { useWishlist } from '@/lib/wishlist-context';
import ImageWithFallback from '@/components/ImageWithFallback';

function localizedName(p: Product, locale: string) {
  if (locale === 'ar') return p.name_ar;
  if (locale === 'en') return p.name_en;
  return p.name_fr;
}

/**
 * HomeProductCard — carte style design de référence.
 * Utilisée uniquement sur la page d'accueil (Nouveautés).
 * Ne remplace pas ProductCard (encore utilisé sur /boutique).
 */
export default function HomeProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations('product');
  const { isSaved, toggle } = useWishlist();
  const image = product.images.find((i) => i.is_primary) ?? product.images[0];
  const inStock = totalStock(product) > 0;
  const colors = availableColors(product);
  const saved = isSaved(product.id);

  return (
    <Link
      href={`/${locale}/produit/${product.slug}`}
      className="group block overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderRadius: '1.1rem',
        background: '#fff',
        boxShadow: '0 2px 14px -3px rgba(46,27,27,0.09)',
      }}
    >
      {/* Zone image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '3 / 4', background: '#FDF0EE' }}
      >
        {image && (
          <ImageWithFallback
            src={image.url}
            alt={image.alt_text_fr}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 48vw, 25vw"
          />
        )}

        {/* Badge NOUVEAU — haut gauche */}
        {product.is_new && (
          <div className="absolute left-2 top-2 rtl:left-auto rtl:right-2">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ background: 'linear-gradient(135deg, #B76E79, #C98374)' }}
            >
              {t('new')}
            </span>
          </div>
        )}

        {/* Bouton favoris — haut droite */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          aria-label="Ajouter aux favoris"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110 rtl:right-auto rtl:left-2"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <Heart
            size={15}
            className={saved ? 'fill-[#B76E79] text-[#B76E79]' : 'text-[#3A332F]'}
          />
        </button>

        {/* Rupture de stock */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/65">
            <span
              className="inline-block rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase text-white"
              style={{ background: '#2E2A27' }}
            >
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* Infos produit */}
      <div className="px-3 py-2.5">
        <p
          className="line-clamp-1 font-body font-medium text-[#2E1B1B]"
          style={{ fontSize: 'clamp(0.75rem, 2.8vw, 0.875rem)' }}
        >
          {localizedName(product, locale)}
        </p>

        <div className="mt-1">
          <span
            className="font-body font-semibold"
            style={{ color: '#C98374', fontSize: 'clamp(0.8rem, 3vw, 0.95rem)' }}
          >
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Points de couleur */}
        {colors.length > 0 && (
          <div className="mt-1.5 flex gap-1">
            {colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: c.hex,
                  border: '1px solid rgba(46,27,27,0.12)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
