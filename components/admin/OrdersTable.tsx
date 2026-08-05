'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Download } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

const STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: 'Nouvelle', a_confirmer: 'À confirmer', confirmee: 'Confirmée',
  en_preparation: 'En préparation', expediee: 'Expédiée', livree: 'Livrée',
  annulee: 'Annulée', refusee: 'Refusée', retournee: 'Retournée',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  nouvelle: 'bg-gold-400', a_confirmer: 'bg-gold-400', confirmee: 'bg-rosegold-400',
  en_preparation: 'bg-charcoal-700', expediee: 'bg-charcoal-700', livree: 'bg-green-500',
  annulee: 'bg-red-500', refusee: 'bg-red-500', retournee: 'bg-red-500',
};

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [city, setCity] = useState('all');

  const cities = useMemo(() => Array.from(new Set(orders.map((o) => o.city))), [orders]);

  const filtered = orders.filter((o) => {
    if (status !== 'all' && o.status !== status) return false;
    if (city !== 'all' && o.city !== city) return false;
    if (query && !o.customer_name.toLowerCase().includes(query.toLowerCase()) && !o.order_number.includes(query)) return false;
    return true;
  });

  function exportCsv() {
    const header = ['Numéro', 'Date', 'Client', 'Téléphone', 'Ville', 'Total', 'Paiement', 'Statut'];
    const rows = filtered.map((o) => [
      o.order_number, new Date(o.created_at).toLocaleDateString('fr-FR'), o.customer_name,
      o.phone, o.city, o.total, o.payment_method, STATUS_LABELS[o.status],
    ]);
    const csv = [header, ...rows].map((r) => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'commandes.csv';
    a.click();
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-700/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (nom, numéro)..."
            className="w-full rounded-full border border-blush-200 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-full border border-blush-200 px-3 py-2 text-sm">
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-full border border-blush-200 px-3 py-2 text-sm">
          <option value="all">Toutes les villes</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={exportCsv} className="btn-secondary !px-4 !py-2 text-xs"><Download size={14} /> Exporter CSV</button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-soft bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-blush-100 text-charcoal-800">
            <tr>
              <th className="p-3 text-start">Commande</th>
              <th className="p-3 text-start">Cliente</th>
              <th className="p-3 text-start">Ville</th>
              <th className="p-3 text-start">Total</th>
              <th className="p-3 text-start">Statut</th>
              <th className="p-3 text-start">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-blush-100">
                <td className="p-3">
                  <Link href={`/admin/commandes/${o.id}`} className="font-medium text-rosegold-500 hover:underline">
                    {o.order_number}
                  </Link>
                </td>
                <td className="p-3">{o.customer_name}</td>
                <td className="p-3">{o.city}</td>
                <td className="p-3">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <span className={`badge ${STATUS_COLORS[o.status]} text-white`}>{STATUS_LABELS[o.status]}</span>
                </td>
                <td className="p-3 text-charcoal-700">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-center text-charcoal-700">Aucune commande trouvée.</p>}
      </div>
    </div>
  );
}

export { STATUS_LABELS, STATUS_COLORS };
