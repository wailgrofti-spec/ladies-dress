'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/admin/ui/Toast';

interface PromoRow {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  used_count: number;
  usage_limit: number | null;
  is_active: boolean;
}

export default function AdminPromoCodesPage() {
  const { toast } = useToast();
  const [codes, setCodes] = useState<PromoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/promo-codes')
      .then((r) => r.json())
      .then((data) => {
        setIsDemo(!!data.demo);
        setCodes(data.promos ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/promo-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, discount_type: type, discount_value: Number(value), min_order_amount: Number(minOrder) || 0 }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.demo) {
      toast(data.message, 'info');
    } else {
      setCodes((prev) => [...prev, data.promo]);
      toast('Code promo créé.', 'success');
    }
    setCode(''); setValue(''); setMinOrder('');
  }

  async function toggleActive(p: PromoRow) {
    const res = await fetch(`/api/promo-codes/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast(p.is_active ? 'Code désactivé.' : 'Code activé.', 'success');
    setCodes((prev) => prev.map((c) => (c.id === p.id ? { ...c, is_active: !c.is_active } : c)));
  }

  async function remove(id: string) {
    const res = await fetch(`/api/promo-codes/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast('Code supprimé.', 'success');
    setCodes((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Codes promotionnels</h1>
      {isDemo && (
        <p className="mt-2 rounded-lg bg-gold-400/20 p-3 text-xs text-charcoal-800 dark:text-gray-200">
          Supabase n'est pas configuré : cette page reflète la base réelle une fois connectée. En
          attendant, la création est visible en local le temps de la session uniquement.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {loading && <Loader2 className="animate-spin text-rosegold-400" />}
          {!loading && codes.length === 0 && <p className="text-sm text-charcoal-700 dark:text-gray-400">Aucun code promo pour le moment.</p>}
          {codes.map((c) => (
            <div key={c.id} className="card flex items-center justify-between p-4 dark:bg-admin-surface2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-charcoal-800 dark:text-gray-100">{c.code}</p>
                  <span className={`badge ${c.is_active ? 'bg-green-500' : 'bg-charcoal-700'} text-white`}>
                    {c.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-xs text-charcoal-700 dark:text-gray-500">
                  {c.discount_type === 'percent' ? `-${c.discount_value}%` : `-${c.discount_value} DH`}
                  {c.min_order_amount > 0 && ` · dès ${c.min_order_amount} DH`}
                  {' · '}{c.used_count} utilisation(s){c.usage_limit ? ` / ${c.usage_limit}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(c)} className="btn-secondary !px-3 !py-1.5 text-xs">
                  {c.is_active ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => remove(c.id)}><Trash2 size={16} className="text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="card h-fit space-y-3 p-5 dark:bg-admin-surface2">
          <p className="font-semibold text-charcoal-800 dark:text-gray-100"><Plus size={16} className="inline" /> Nouveau code</p>
          <input required placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100" />
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100">
            <option value="percent">Pourcentage (%)</option>
            <option value="fixed">Montant fixe (DH)</option>
          </select>
          <input required type="number" placeholder="Valeur" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100" />
          <input type="number" placeholder="Montant minimum (optionnel)" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100" />
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? 'Ajout...' : 'Ajouter le code'}
          </button>
        </form>
      </div>
    </div>
  );
}
