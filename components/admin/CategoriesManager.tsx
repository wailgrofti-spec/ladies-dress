'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, EyeOff, Eye } from 'lucide-react';
import { Category } from '@/lib/types';
import { useToast } from './ui/Toast';
import Dialog from './ui/Dialog';

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const { toast } = useToast();
  const [list, setList] = useState(categories);
  const [form, setForm] = useState({ name_fr: '', name_ar: '', name_en: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const slug = form.name_fr.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.demo) {
      toast(data.message, 'info');
    } else {
      setList((prev) => [...prev, data.category]);
      setForm({ name_fr: '', name_ar: '', name_en: '' });
      toast('Catégorie ajoutée.', 'success');
    }
  }

  async function toggleActive(c: Category) {
    const res = await fetch(`/api/categories/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !c.is_active }),
    });
    const data = await res.json();
    if (data.demo) {
      toast(data.message, 'info');
    } else {
      toast(c.is_active ? 'Catégorie masquée.' : 'Catégorie rendue visible.', 'success');
    }
    // Optimiste dans les deux cas : en mode démo, l'UI reste testable même sans sauvegarde réelle
    setList((prev) => prev.map((cat) => (cat.id === c.id ? { ...cat, is_active: !cat.is_active } : cat)));
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast('Catégorie supprimée.', 'success');
    setList((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        {list.map((c) => (
          <div key={c.id} className="card flex items-center gap-4 p-4 dark:bg-admin-surface2">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-blush-100 dark:bg-admin-surface">
              {c.image_url && <Image src={c.image_url} alt={c.name_fr} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-charcoal-800 dark:text-gray-100">{c.name_fr}</p>
              <p className="text-xs text-charcoal-700 dark:text-gray-500">{c.name_ar} · {c.name_en}</p>
            </div>
            <span className={`badge ${c.is_active ? 'bg-green-500' : 'bg-charcoal-700'} text-white`}>
              {c.is_active ? 'Visible' : 'Masquée'}
            </span>
            <button onClick={() => toggleActive(c)} className="rounded-full p-2 hover:bg-blush-100 dark:hover:bg-admin-surface">
              {c.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button onClick={() => setDeleteTarget(c)} className="rounded-full p-2 hover:bg-blush-100 dark:hover:bg-admin-surface">
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="card h-fit space-y-3 p-5 dark:bg-admin-surface2">
        <p className="font-semibold text-charcoal-800 dark:text-gray-100"><Plus size={16} className="inline" /> Nouvelle catégorie</p>
        <input required placeholder="Nom (français)" value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100" />
        <input placeholder="Nom (arabe)" dir="rtl" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100" />
        <input placeholder="Nom (anglais)" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100" />
        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
          {saving ? 'Ajout...' : 'Ajouter'}
        </button>
      </form>

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer cette catégorie ?"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary !px-4 !py-2 text-sm">Annuler</button>
            <button onClick={confirmDelete} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">Supprimer</button>
          </>
        }
      >
        <p>
          <strong>{deleteTarget?.name_fr}</strong> — les produits déjà associés à cette catégorie ne
          seront pas supprimés, mais n'auront plus de catégorie assignée.
        </p>
      </Dialog>
    </div>
  );
}
