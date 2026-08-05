'use client';

import { useEffect, useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { StockMovement } from '@/lib/types';

export default function StockHistory({ productId }: { productId: string }) {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${productId}/stock`)
      .then((r) => r.json())
      .then((data) => setMovements(data.movements ?? []))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <p className="text-sm text-charcoal-700 dark:text-gray-400">Chargement...</p>;
  if (movements.length === 0) {
    return <p className="text-sm text-charcoal-700 dark:text-gray-400">Aucun mouvement de stock enregistré pour ce produit pour le moment.</p>;
  }

  return (
    <div className="space-y-2">
      {movements.map((m) => (
        <div key={m.id} className="flex items-center justify-between rounded-lg bg-blush-50 px-3 py-2 text-sm dark:bg-admin-surface">
          <div className="flex items-center gap-2">
            {m.change > 0 ? <ArrowUpCircle size={16} className="text-green-500" /> : <ArrowDownCircle size={16} className="text-red-500" />}
            <span className="dark:text-gray-200">{m.change > 0 ? `+${m.change}` : m.change} unité(s)</span>
            <span className="text-xs text-charcoal-700 dark:text-gray-500">({m.reason})</span>
          </div>
          <span className="text-xs text-charcoal-700 dark:text-gray-500">{new Date(m.created_at).toLocaleString('fr-FR')}</span>
        </div>
      ))}
    </div>
  );
}
