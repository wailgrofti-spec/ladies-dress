'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Printer } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { buildWhatsappLink, buildStatusUpdateMessage } from '@/lib/whatsapp';
import { useToast } from './ui/Toast';
import { STATUS_LABELS } from './OrdersTable';

export default function OrderDetail({ order }: { order: Order }) {
  const { toast } = useToast();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [notes, setNotes] = useState(order.admin_notes ?? '');
  const [saving, setSaving] = useState(false);

  const whatsappHref = buildWhatsappLink(buildStatusUpdateMessage(status, order.order_number, order.customer_name));

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_notes: notes }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.demo) toast(data.message, 'info');
    else {
      toast('Commande mise à jour.', 'success');
      if (data.stockNote) toast(data.stockNote, 'info');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="card p-5">
          <p className="font-semibold text-charcoal-800">Articles commandés</p>
          <div className="mt-3 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between border-b border-blush-100 pb-2 text-sm last:border-0">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-xs text-charcoal-700">{item.color} · Pointure {item.size} · x{item.quantity}</p>
                </div>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-charcoal-700">Sous-total</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-charcoal-700">Livraison</span><span>{formatPrice(order.shipping_fee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-charcoal-700">Remise</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between border-t border-blush-200 pt-2 font-semibold"><span>Total</span><span className="text-rosegold-500">{formatPrice(order.total)}</span></div>
          </div>
        </div>

        <div className="card p-5">
          <p className="font-semibold text-charcoal-800">Livraison</p>
          <div className="mt-3 space-y-1 text-sm text-charcoal-700">
            <p><strong>{order.customer_name}</strong></p>
            <p>{order.address}{order.neighborhood ? `, ${order.neighborhood}` : ''}</p>
            <p>{order.city}</p>
            {order.landmark && <p>Repère : {order.landmark}</p>}
            {order.comment && <p className="mt-2 italic">« {order.comment} »</p>}
          </div>
          <div className="mt-4 flex gap-3">
            <a href={`tel:${order.phone}`} className="btn-secondary !px-4 !py-2 text-xs"><Phone size={14} /> Appeler</a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !px-4 !py-2 text-xs"><MessageCircle size={14} /> Notifier (statut: {STATUS_LABELS[status]})</a>
            <button onClick={() => window.print()} className="btn-secondary !px-4 !py-2 text-xs"><Printer size={14} /> Imprimer</button>
          </div>
        </div>
      </div>

      <div className="card h-fit space-y-4 p-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal-800">Statut</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm">
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal-800">Note interne</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm" />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary w-full disabled:opacity-50">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}
