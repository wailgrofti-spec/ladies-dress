'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { MessageCircle, ShoppingBag, Truck, RefreshCw } from 'lucide-react';
import { Product } from '@/lib/types';
import { availableColors, availableSizesForColor } from '@/lib/data';
import { formatPrice, discountPercent } from '@/lib/utils';
import { buildWhatsappLink, buildProductWhatsappMessage } from '@/lib/whatsapp';
import { useCart } from '@/lib/cart-context';

function localizedField(p: Product, field: 'name' | 'description', locale: string) {
  const key = `${field}_${locale === 'ar' ? 'ar' : locale === 'en' ? 'en' : 'fr'}` as keyof Product;
  return p[key] as string;
}

export default function ProductDetail({ product, url }: { product: Product; url: string }) {
  const locale = useLocale();
  const t = useTranslations('product');
  const { addItem } = useCart();

  const colors = availableColors(product);
  const [color, setColor] = useState(colors[0]?.name ?? '');
  const sizesForColor = useMemo(() => availableSizesForColor(product, color), [product, color]);
  const [size, setSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const discount = discountPercent(product.price, product.old_price);
  const name = localizedField(product, 'name', locale);
  const description = localizedField(product, 'description', locale);

  const selectedVariant = product.variants.find((v) => v.color_name === color && v.size === size);

  function handleAddToCart() {
    if (!size) return;
    const image = product.images.find((i) => i.is_primary) ?? product.images[0];
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? `${product.id}-${color}-${size}`,
      slug: product.slug,
      name,
      image: image?.url ?? '',
      price: product.price,
      color,
      size,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const whatsappHref = buildWhatsappLink(
    buildProductWhatsappMessage({ productName: name, size: size ?? undefined, color, price: product.price, url })
  );

  return (
    <div className="container-app grid gap-8 py-8 md:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="aspect-square overflow-hidden rounded-soft bg-blush-100">
          {product.images[activeImage] && (
            <Image
              src={product.images[activeImage].url}
              alt={product.images[activeImage].alt_text_fr}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                  i === activeImage ? 'border-rosegold-400' : 'border-transparent'
                }`}
              >
                <Image src={img.url} alt={img.alt_text_fr} width={64} height={64} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-charcoal-900 sm:text-3xl">{name}</h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl font-semibold text-rosegold-500">{formatPrice(product.price)}</span>
          {product.old_price && (
            <>
              <span className="text-base text-charcoal-700/60 line-through">{formatPrice(product.old_price)}</span>
              {discount && <span className="badge bg-rosegold-400 text-white">-{discount}%</span>}
            </>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-charcoal-700">{description}</p>
        <p className="mt-2 text-sm text-charcoal-700"><strong>{t('material')} :</strong> {product.material}</p>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-charcoal-800">{t('selectColor')}</p>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { setColor(c.name); setSize(null); }}
                  title={c.name}
                  className={`h-9 w-9 rounded-full border-2 ${
                    color === c.name ? 'border-rosegold-400' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex, boxShadow: '0 0 0 1px rgba(0,0,0,0.1)' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-charcoal-800">{t('selectSize')}</p>
            <button className="text-xs text-rosegold-500 underline">{t('sizeGuide')}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {['36', '37', '38', '39', '40', '41'].map((s) => {
              const available = sizesForColor.includes(s);
              return (
                <button
                  key={s}
                  disabled={!available}
                  onClick={() => setSize(s)}
                  className={`h-10 w-12 rounded-lg border text-sm font-medium ${
                    size === s
                      ? 'border-rosegold-400 bg-rosegold-400 text-white'
                      : available
                      ? 'border-blush-200 bg-white text-charcoal-800 hover:border-rosegold-400'
                      : 'cursor-not-allowed border-blush-100 bg-blush-50 text-charcoal-700/40 line-through'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            disabled={!size}
            className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={18} /> {added ? '✓' : t('addToCart')}
          </button>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp flex-1">
            <MessageCircle size={18} /> {t('orderWhatsapp')}
          </a>
        </div>

        {/* Delivery / returns info */}
        <div className="mt-8 space-y-3 rounded-soft bg-blush-50 p-4">
          <div className="flex items-start gap-3 text-sm text-charcoal-700">
            <Truck size={18} className="mt-0.5 shrink-0 text-rosegold-400" />
            <p>{t('delivery')} : 24 à 72h selon votre ville, paiement à la livraison disponible.</p>
          </div>
          <div className="flex items-start gap-3 text-sm text-charcoal-700">
            <RefreshCw size={18} className="mt-0.5 shrink-0 text-rosegold-400" />
            <p>{t('returns')} : échange possible sous 7 jours si l'article est inutilisé.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
