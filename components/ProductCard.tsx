'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { Product, Locale } from '@/lib/types';
import { formatPrice, discountPercent } from '@/lib/utils';
import { totalStock, availableColors } from '@/lib/data';
import { useWishlist } from '@/lib/wishlist-context';

function localizedName(p: Product, locale: string) {
  if (locale === 'ar') return p.name_ar;
  if (locale === 'en') return p.name_en;
  return p.name_fr;
}

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations('product');
  const { isSaved, toggle } = useWishlist();
  const image = product.images.find((i) => i.is_primary) ?? product.images[0];
  const discount = discountPercent(product.price, product.old_price);
  const inStock = totalStock(product) > 0;
  const colors = availableColors(product);
  const saved = isSaved(product.id);

  return (
    <Link
      href={`/${locale}/produit/${product.slug}`}
      className="card group block overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-blush-100">
        {image && (
          <Image
            src={image.url}
            alt={image.alt_text_fr}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        <div className="absolute left-2 top-2 flex flex-col gap-1 rtl:left-auto rtl:right-2">
          {product.is_new && <span className="badge bg-charcoal-800 text-white">{t('new')}</span>}
          {discount && <span className="badge bg-rosegold-400 text-white">-{discount}%</span>}
          {product.is_bestseller && <span className="badge bg-gold-400 text-white">{t('bestseller')}</span>}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id); }}
          aria-label="Ajouter aux favoris"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110 rtl:right-auto rtl:left-2"
        >
          <Heart size={16} className={saved ? 'fill-rosegold-500 text-rosegold-500' : 'text-charcoal-700'} />
        </button>

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="badge bg-charcoal-800 text-white">{t('outOfStock')}</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="line-clamp-1 text-sm font-medium text-charcoal-800">{localizedName(product, locale)}</p>

        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-rosegold-500">{formatPrice(product.price)}</span>
          {product.old_price && (
            <span className="text-xs text-charcoal-700/60 line-through">{formatPrice(product.old_price)}</span>
          )}
        </div>

        {colors.length > 0 && (
          <div className="mt-2 flex gap-1">
            {colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-charcoal-800/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
