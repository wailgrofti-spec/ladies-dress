'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { buildWhatsappLink, buildOrderWhatsappMessage } from '@/lib/whatsapp';
import { PaymentMethod } from '@/lib/types';

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Kénitra', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Salé', 'Témara', 'Mohammédia', 'El Jadida', 'Autre ville',
];

interface ShippingZone {
  city_name: string;
  price: number;
  is_active: boolean;
  free_shipping_threshold: number | null;
}

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const router = useRouter();
  const { items, subtotal, clearCart, promo, discountAmount } = useCart();

  const [form, setForm] = useState({
    customer_name: '', phone: '', whatsapp: '', city: MOROCCAN_CITIES[0],
    address: '', neighborhood: '', landmark: '', comment: '',
  });
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [paymentMethods, setPaymentMethods] = useState({ cod: true, online: false, bankTransfer: true });
  const [loadingShipping, setLoadingShipping] = useState(true);

  // Récupère les vrais frais de livraison par ville et les moyens de
  // paiement activés depuis l'admin (table shipping_zones + site_settings).
  useEffect(() => {
    fetch('/api/shipping/public')
      .then((r) => r.json())
      .then((data) => {
        setZones(data.zones ?? []);
        setPaymentMethods(data.paymentMethods ?? { cod: true, online: false, bankTransfer: true });
      })
      .finally(() => setLoadingShipping(false));
  }, []);

  const totalAfterDiscount = subtotal - discountAmount;

  const shipping = useMemo(() => {
    if (zones.length === 0) return 25; // repli si aucune configuration trouvée
    const zone = zones.find((z) => z.city_name.toLowerCase() === form.city.toLowerCase() && z.is_active)
      ?? zones.find((z) => z.city_name.toLowerCase() === 'autre ville' && z.is_active);
    if (!zone) return 25;
    if (zone.free_shipping_threshold && totalAfterDiscount >= zone.free_shipping_threshold) return 0;
    return zone.price;
  }, [zones, form.city, totalAfterDiscount]);

  const total = totalAfterDiscount + shipping;

  const availablePayments = (['cod', 'online', 'bank_transfer'] as PaymentMethod[]).filter((pm) => {
    if (pm === 'cod') return paymentMethods.cod;
    if (pm === 'online') return paymentMethods.online;
    return paymentMethods.bankTransfer;
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          payment_method: payment,
          subtotal,
          shipping_fee: shipping,
          discount: discountAmount,
          promo_code: promo?.code ?? null,
          total,
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      clearCart();
      router.push(`/${locale}/commande/confirmation/${data.order_number}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue, réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  const whatsappHref = buildWhatsappLink(
    buildOrderWhatsappMessage({
      orderNumber: '(à confirmer)',
      customerName: form.customer_name || '—',
      city: form.city,
      total,
      items: items.map((i) => ({ name: i.name, size: i.size, color: i.color, quantity: i.quantity })),
    })
  );

  return (
    <div className="container-app py-8">
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">{t('title')}</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="card space-y-4 p-5">
          <Field label={t('fullName')} required value={form.customer_name} onChange={(v) => update('customer_name', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('phone')} required type="tel" value={form.phone} onChange={(v) => update('phone', v)} />
            <Field label={t('whatsapp')} type="tel" value={form.whatsapp} onChange={(v) => update('whatsapp', v)} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal-800">{t('city')} *</label>
            <select
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm"
              required
            >
              {MOROCCAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Field label={t('address')} required value={form.address} onChange={(v) => update('address', v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label={t('neighborhood')} value={form.neighborhood} onChange={(v) => update('neighborhood', v)} />
            <Field label={t('landmark')} value={form.landmark} onChange={(v) => update('landmark', v)} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal-800">{t('comment')}</label>
            <textarea
              value={form.comment}
              onChange={(e) => update('comment', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-charcoal-800">{t('paymentMethod')}</p>
            <div className="space-y-2">
              {availablePayments.map((pm) => (
                <label key={pm} className="flex items-center gap-2 rounded-lg border border-blush-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === pm}
                    onChange={() => setPayment(pm)}
                    className="accent-rosegold-400"
                  />
                  {pm === 'cod' ? t('cod') : pm === 'online' ? t('online') : t('bankTransfer')}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="card h-fit space-y-4 p-5">
          <p className="font-semibold text-charcoal-800">{items.length} article(s)</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-charcoal-700">Sous-total</span><span>{formatPrice(subtotal)}</span></div>
            {promo && (
              <div className="flex justify-between text-green-600">
                <span>Réduction ({promo.code})</span><span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-charcoal-700">Livraison ({form.city})</span>
              <span>{loadingShipping ? '...' : shipping === 0 ? 'Gratuit' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-blush-200 pt-2 font-semibold"><span>Total</span><span className="text-rosegold-500">{formatPrice(total)}</span></div>
          </div>

          <button type="submit" disabled={submitting || items.length === 0} className="btn-primary w-full disabled:opacity-50">
            {submitting ? '...' : t('submit')}
          </button>

          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
            {t('orWhatsapp')}
          </a>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, value, onChange, required, type = 'text',
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-charcoal-800">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm"
      />
    </div>
  );
}
