'use client';

import { useState } from 'react';
import { Search, Phone, MessageCircle } from 'lucide-react';
import { Customer } from '@/lib/customers-data';
import { formatPrice } from '@/lib/utils';
import { buildWhatsappLink } from '@/lib/whatsapp';

const STATUS_LABELS: Record<Customer['status'], string> = {
  nouveau: 'Nouveau', fidele: 'Fidèle', vip: 'VIP',
};
const STATUS_COLORS: Record<Customer['status'], string> = {
  nouveau: 'bg-charcoal-700', fidele: 'bg-rosegold-400', vip: 'bg-gold-400',
};

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Customer['status'] | 'all'>('all');

  const filtered = customers.filter((c) => {
    if (status !== 'all' && c.status !== status) return false;
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.phone.includes(query)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-700/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (nom, téléphone)..."
            className="w-full rounded-full border border-blush-200 py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-full border border-blush-200 px-3 py-2 text-sm">
          <option value="all">Tous les statuts</option>
          <option value="nouveau">Nouveau</option>
          <option value="fidele">Fidèle</option>
          <option value="vip">VIP</option>
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-soft bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-blush-100 text-charcoal-800">
            <tr>
              <th className="p-3 text-start">Cliente</th>
              <th className="p-3 text-start">Ville</th>
              <th className="p-3 text-start">Commandes</th>
              <th className="p-3 text-start">Total dépensé</th>
              <th className="p-3 text-start">Dernière commande</th>
              <th className="p-3 text-start">Statut</th>
              <th className="p-3 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.phone} className="border-t border-blush-100">
                <td className="p-3">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-charcoal-700">{c.phone}</p>
                </td>
                <td className="p-3 text-charcoal-700">{c.city}</td>
                <td className="p-3">{c.orderCount}</td>
                <td className="p-3 font-semibold">{formatPrice(c.totalSpent)}</td>
                <td className="p-3 text-charcoal-700">{new Date(c.lastOrderDate).toLocaleDateString('fr-FR')}</td>
                <td className="p-3">
                  <span className={`badge ${STATUS_COLORS[c.status]} text-white`}>{STATUS_LABELS[c.status]}</span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <a href={`tel:${c.phone}`} className="rounded-full p-1.5 hover:bg-blush-100"><Phone size={16} /></a>
                    <a href={buildWhatsappLink(`Bonjour ${c.name}, c'est Ladies Dress 👋`)} target="_blank" rel="noopener noreferrer" className="rounded-full p-1.5 hover:bg-blush-100">
                      <MessageCircle size={16} className="text-[#25D366]" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-center text-charcoal-700">Aucune cliente trouvée.</p>}
      </div>
    </div>
  );
}
