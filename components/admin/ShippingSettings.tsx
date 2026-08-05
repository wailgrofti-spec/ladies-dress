'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from './ui/Toast';

interface Zone {
  id: string;
  city_name: string;
  price: number;
  is_active: boolean;
  free_shipping_threshold: number | null;
}

export default function ShippingSettings({
  zones, initialOnlinePayment, initialBankTransfer,
}: { zones: Zone[]; initialOnlinePayment: boolean; initialBankTransfer: boolean }) {
  const { toast } = useToast();
  const [list, setList] = useState(zones);
  const [newCity, setNewCity] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [onlinePayment, setOnlinePayment] = useState(initialOnlinePayment);
  const [bankTransfer, setBankTransfer] = useState(initialBankTransfer);

  async function savePaymentSetting(key: string, value: boolean, setter: (v: boolean) => void) {
    setter(value); // optimiste
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value_fr: value ? '1' : '0' }),
    });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast('Paramètre de paiement mis à jour.', 'success');
  }

  async function addZone() {
    if (!newCity || !newPrice) return;
    const res = await fetch('/api/shipping-zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city_name: newCity, price: Number(newPrice) }),
    });
    const data = await res.json();
    if (data.demo) {
      toast(data.message, 'info');
      setList((prev) => [...prev, { id: `demo-${Date.now()}`, city_name: newCity, price: Number(newPrice), is_active: true, free_shipping_threshold: 500 }]);
    } else {
      setList((prev) => [...prev, data.zone]);
      toast('Ville ajoutée.', 'success');
    }
    setNewCity('');
    setNewPrice('');
  }

  async function updatePrice(id: string, price: number) {
    setList((prev) => prev.map((z) => (z.id === id ? { ...z, price } : z)));
  }

  async function commitPrice(id: string, price: number) {
    const res = await fetch(`/api/shipping-zones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price }),
    });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast('Tarif mis à jour.', 'success');
  }

  async function toggleActive(z: Zone) {
    const res = await fetch(`/api/shipping-zones/${z.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !z.is_active }),
    });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast(z.is_active ? 'Ville désactivée.' : 'Ville activée.', 'success');
    setList((prev) => prev.map((zone) => (zone.id === z.id ? { ...zone, is_active: !zone.is_active } : zone)));
  }

  async function remove(id: string) {
    const res = await fetch(`/api/shipping-zones/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast('Ville supprimée.', 'success');
    setList((prev) => prev.filter((z) => z.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 dark:bg-admin-surface2">
        <p className="font-semibold text-charcoal-800 dark:text-gray-100">Modes de paiement</p>
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center justify-between rounded-lg border border-blush-200 p-3 dark:border-admin-border">
            Paiement à la livraison <span className="badge bg-green-500 text-white">Toujours actif</span>
          </label>
          <label className="flex items-center justify-between rounded-lg border border-blush-200 p-3 dark:border-admin-border">
            Paiement en ligne
            <input type="checkbox" checked={onlinePayment} onChange={(e) => savePaymentSetting('payment_online_enabled', e.target.checked, setOnlinePayment)} className="accent-rosegold-400" />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-blush-200 p-3 dark:border-admin-border">
            Virement bancaire
            <input type="checkbox" checked={bankTransfer} onChange={(e) => savePaymentSetting('payment_bank_transfer_enabled', e.target.checked, setBankTransfer)} className="accent-rosegold-400" />
          </label>
        </div>
        <p className="mt-2 text-xs text-charcoal-700 dark:text-gray-500">
          Ces réglages contrôlent en temps réel les moyens de paiement proposés au client lors du
          tunnel de commande.
        </p>
      </div>

      <div className="card p-5 dark:bg-admin-surface2">
        <p className="font-semibold text-charcoal-800 dark:text-gray-100">Frais de livraison par ville</p>
        <div className="mt-3 space-y-2">
          {list.map((z) => (
            <div key={z.id} className="flex items-center gap-3 rounded-lg border border-blush-200 p-3 text-sm dark:border-admin-border">
              <span className="flex-1 dark:text-gray-200">{z.city_name}</span>
              <input
                type="number"
                value={z.price}
                onChange={(e) => updatePrice(z.id, Number(e.target.value))}
                onBlur={(e) => commitPrice(z.id, Number(e.target.value))}
                className="w-20 rounded-lg border border-blush-200 px-2 py-1 text-center dark:border-admin-border dark:bg-admin-surface"
              />
              <span className="text-xs text-charcoal-700 dark:text-gray-500">DH</span>
              <button onClick={() => toggleActive(z)} className={`badge ${z.is_active ? 'bg-green-500' : 'bg-charcoal-700'} text-white`}>
                {z.is_active ? 'Active' : 'Désactivée'}
              </button>
              <button onClick={() => remove(z.id)}><Trash2 size={16} className="text-red-500" /></button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="Nouvelle ville" className="flex-1 rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100" />
          <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} type="number" placeholder="Prix (DH)" className="w-28 rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100" />
          <button onClick={addZone} className="btn-secondary !px-3 !py-2 text-xs"><Plus size={14} /></button>
        </div>
        <p className="mt-3 text-xs text-charcoal-700 dark:text-gray-500">
          Ces tarifs sont utilisés en temps réel lors du calcul des frais de livraison au moment de
          la commande, selon la ville choisie par la cliente.
        </p>
      </div>
    </div>
  );
}
