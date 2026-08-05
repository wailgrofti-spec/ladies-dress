'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Minus, Plus, Trash2, Tag, X, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const { items, removeItem, updateQuantity, subtotal, promo, promoError, applyPromo, removePromo, discountAmount } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [applying, setApplying] = useState(false);

  const totalAfterDiscount = subtotal - discountAmount;

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;
    setApplying(true);
    await applyPromo(promoInput.trim());
    setApplying(false);
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-charcoal-900">{t('title')}</h1>
        <p className="mt-3 text-charcoal-700">{t('empty')}</p>
        <Link href={`/${locale}/boutique`} className="btn-primary mt-6 inline-flex">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">{t('title')}</h1>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.variantId} className="card flex gap-4 p-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-blush-100">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="font-medium text-charcoal-800">{item.name}</p>
                <p className="text-xs text-charcoal-700">
                  {t('color')}: {item.color} · {t('size')}: {item.size}
                </p>
                <p className="mt-1 font-semibold text-rosegold-500">{formatPrice(item.price)}</p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-blush-200 px-2 py-1">
                    <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="flex items-center gap-1 text-xs text-charcoal-700 hover:text-rosegold-500"
                  >
                    <Trash2 size={14} /> {t('remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-5">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal-700">{t('subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {promo && (
              <div className="flex justify-between text-green-600">
                <span>Réduction ({promo.code})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-charcoal-700">{t('shipping')}</span>
              <span className="text-xs text-charcoal-700">Calculés à l'étape suivante selon votre ville</span>
            </div>
          </div>

          {promo ? (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 text-sm">
              <span className="flex items-center gap-2 text-green-700"><Tag size={14} /> {promo.code} appliqué</span>
              <button onClick={removePromo} className="text-green-700"><X size={14} /></button>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={t('promoCode')}
                  className="flex-1 rounded-lg border border-blush-200 px-3 py-2 text-sm"
                />
                <button onClick={handleApplyPromo} disabled={applying} className="btn-secondary !px-4 !py-2 text-xs disabled:opacity-50">
                  {applying ? <Loader2 size={14} className="animate-spin" /> : t('apply')}
                </button>
              </div>
              {promoError && <p className="mt-1 text-xs text-red-500">{promoError}</p>}
            </div>
          )}

          <div className="mt-4 flex justify-between border-t border-blush-200 pt-4 font-semibold">
            <span>{t('total')} (hors livraison)</span>
            <span className="text-rosegold-500">{formatPrice(totalAfterDiscount)}</span>
          </div>

          <Link href={`/${locale}/commande`} className="btn-primary mt-5 w-full">
            {t('checkout')}
          </Link>
        </div>
      </div>
    </div>
  );
}
