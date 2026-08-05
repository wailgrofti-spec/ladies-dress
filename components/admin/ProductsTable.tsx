'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Plus, Search, Copy, Trash2, Pencil, EyeOff, Eye, Star,
  Upload, Download, FileSpreadsheet, ArrowUpDown, Tag,
} from 'lucide-react';
import { Product, Category, ProductStatus } from '@/lib/types';
import { totalStock } from '@/lib/data';
import { formatPrice, discountPercent, slugify } from '@/lib/utils';
import { useToast } from './ui/Toast';
import Dialog from './ui/Dialog';
import DropdownMenu from './ui/DropdownMenu';
import Pagination from './ui/Pagination';

const PAGE_SIZE = 10;

const STATUS_LABELS: Record<ProductStatus, string> = { active: 'Actif', hidden: 'Masqué', archived: 'Archivé' };
const STATUS_COLORS: Record<ProductStatus, string> = { active: 'bg-green-500', hidden: 'bg-charcoal-700', archived: 'bg-red-500' };

type SortKey = 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc';

export default function ProductsTable({ products, categories }: { products: Product[]; categories: Category[] }) {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [sort, setSort] = useState<SortKey>('date_desc');
  const [page, setPage] = useState(1);
  const [list, setList] = useState(products);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [promoTarget, setPromoTarget] = useState<Product | null>(null);
  const [importing, setImporting] = useState(false);

  function categoryName(id: string) {
    return categories.find((c) => c.id === id)?.name_fr ?? '—';
  }
  function statusOf(p: Product): ProductStatus {
    return p.status ?? (p.is_active ? 'active' : 'hidden');
  }

  const filtered = useMemo(() => {
    let l = list.filter((p) => p.name_fr.toLowerCase().includes(query.toLowerCase()) || (p.sku ?? '').toLowerCase().includes(query.toLowerCase()));
    if (categoryFilter !== 'all') l = l.filter((p) => p.category_id === categoryFilter);
    if (statusFilter !== 'all') l = l.filter((p) => statusOf(p) === statusFilter);

    switch (sort) {
      case 'price_asc': l = [...l].sort((a, b) => a.price - b.price); break;
      case 'price_desc': l = [...l].sort((a, b) => b.price - a.price); break;
      case 'date_asc': l = [...l].sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()); break;
      default: l = [...l].sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    }
    return l;
  }, [list, query, categoryFilter, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function patch(id: string, body: Record<string, any>, successMsg: string) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast(successMsg, 'success');
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, ...body } : p)));
  }

  async function handleDuplicate(product: Product) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        slug: `${product.slug}-copie-${Date.now().toString().slice(-4)}`,
        sku: product.sku ? `${product.sku}-COPY` : undefined,
        name_fr: `${product.name_fr} (copie)`,
      }),
    });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else {
      setList((prev) => [data.product, ...prev]);
      toast('Produit dupliqué.', 'success');
    }
  }

  async function confirmDelete(mode: 'archive' | 'permanent') {
    if (!deleteTarget) return;
    const res = await fetch(`/api/products/${deleteTarget.id}?mode=${mode}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.demo) toast(data.message, 'info');
    else toast(mode === 'archive' ? 'Produit archivé.' : 'Produit supprimé définitivement.', 'success');

    if (mode === 'permanent') setList((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    else setList((prev) => prev.map((p) => (p.id === deleteTarget.id ? { ...p, status: 'archived', is_active: false } : p)));
    setDeleteTarget(null);
  }

  function exportCsv() {
    const rows = filtered.map((p) => ({
      sku: p.sku ?? '', name_fr: p.name_fr, name_ar: p.name_ar, name_en: p.name_en,
      category_slug: categories.find((c) => c.id === p.category_id)?.slug ?? '',
      brand: p.brand ?? '', material: p.material, price: p.price, old_price: p.old_price ?? '',
      stock: totalStock(p), status: statusOf(p),
    }));
    const csv = Papa.unparse(rows);
    downloadBlob(csv, 'produits.csv', 'text/csv;charset=utf-8;');
    toast(`${rows.length} produit(s) exporté(s) en CSV.`, 'success');
  }

  function exportExcel() {
    const rows = filtered.map((p) => ({
      SKU: p.sku ?? '', 'Nom (FR)': p.name_fr, 'Nom (AR)': p.name_ar, 'Nom (EN)': p.name_en,
      Catégorie: categoryName(p.category_id), Marque: p.brand ?? '', Matière: p.material,
      Prix: p.price, 'Ancien prix': p.old_price ?? '', Stock: totalStock(p), Statut: STATUS_LABELS[statusOf(p)],
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Produits');
    XLSX.writeFile(wb, 'produits.xlsx');
    toast(`${rows.length} produit(s) exporté(s) en Excel.`, 'success');
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);

    try {
      let rows: any[] = [];
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        rows = Papa.parse(text, { header: true, skipEmptyLines: true }).data as any[];
      } else {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer);
        const sheet = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      }

      const normalized = rows.map((r) => ({
        sku: r.sku || r.SKU || '',
        name_fr: r.name_fr || r['Nom (FR)'] || r.name || '',
        name_ar: r.name_ar || r['Nom (AR)'] || '',
        name_en: r.name_en || r['Nom (EN)'] || '',
        category_slug: r.category_slug || slugify(r.Catégorie || r.category || ''),
        brand: r.brand || r.Marque || '',
        material: r.material || r.Matière || '',
        price: Number(r.price || r.Prix || 0),
        old_price: r.old_price || r['Ancien prix'] ? Number(r.old_price || r['Ancien prix']) : undefined,
      }));

      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: normalized }),
      });
      const data = await res.json();
      if (data.demo) toast(data.message, 'info');
      else toast(`${data.imported} produit(s) importé(s)${data.errors?.length ? `, ${data.errors.length} erreur(s)` : ''}.`, 'success');
    } catch (err) {
      toast("Erreur lors de la lecture du fichier. Vérifiez le format (CSV ou Excel).", 'error');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-700/50" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Nom ou SKU..."
              className="w-full rounded-full border border-blush-200 py-2 pl-9 pr-3 text-sm dark:border-admin-border dark:bg-admin-surface2 dark:text-gray-100"
            />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="rounded-full border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface2 dark:text-gray-100">
            <option value="all">Toutes catégories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }} className="rounded-full border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface2 dark:text-gray-100">
            <option value="all">Tous statuts</option>
            <option value="active">Actif</option>
            <option value="hidden">Masqué</option>
            <option value="archived">Archivé</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-full border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface2 dark:text-gray-100">
            <option value="date_desc">Plus récents</option>
            <option value="date_asc">Plus anciens</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={exportCsv} className="btn-secondary !px-3 !py-2 text-xs"><Download size={14} /> CSV</button>
          <button onClick={exportExcel} className="btn-secondary !px-3 !py-2 text-xs"><FileSpreadsheet size={14} /> Excel</button>
          <label className="btn-secondary cursor-pointer !px-3 !py-2 text-xs">
            <Upload size={14} /> {importing ? 'Import...' : 'Importer'}
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleImportFile} className="hidden" disabled={importing} />
          </label>
          <Link href="/admin/produits/nouveau" className="btn-primary !px-4 !py-2 text-xs">
            <Plus size={14} /> Ajouter
          </Link>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-soft bg-white shadow-card dark:bg-admin-surface2">
        <table className="w-full text-sm">
          <thead className="bg-blush-100 text-start text-charcoal-800 dark:bg-admin-surface dark:text-gray-200">
            <tr>
              <th className="p-3 text-start">Produit</th>
              <th className="p-3 text-start">SKU</th>
              <th className="p-3 text-start">Catégorie</th>
              <th className="p-3 text-start">Prix</th>
              <th className="p-3 text-start">Remise</th>
              <th className="p-3 text-start">Stock</th>
              <th className="p-3 text-start">Statut</th>
              <th className="p-3 text-start">Vedette</th>
              <th className="p-3 text-start">Créé le</th>
              <th className="p-3 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => {
              const image = p.images.find((i) => i.is_primary) ?? p.images[0];
              const stock = totalStock(p);
              const discount = discountPercent(p.price, p.old_price);
              const status = statusOf(p);

              return (
                <tr key={p.id} className="border-t border-blush-100 dark:border-admin-border">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-blush-100 dark:bg-admin-surface">
                        {image && <Image src={image.url} alt={p.name_fr} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium dark:text-gray-100">{p.name_fr}</p>
                        {p.is_new && <span className="badge bg-charcoal-800 text-[10px] text-white">Nouveau</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-charcoal-700 dark:text-gray-400">{p.sku || '—'}</td>
                  <td className="p-3 text-charcoal-700 dark:text-gray-400">{categoryName(p.category_id)}</td>
                  <td className="p-3 dark:text-gray-200">
                    {formatPrice(p.price)}
                    {p.old_price && <span className="ms-1 text-xs text-charcoal-700/50 line-through dark:text-gray-500">{formatPrice(p.old_price)}</span>}
                  </td>
                  <td className="p-3">{discount ? <span className="badge bg-rosegold-400 text-white">-{discount}%</span> : '—'}</td>
                  <td className="p-3">
                    <span className={stock === 0 ? 'font-semibold text-red-500' : stock <= 5 ? 'font-semibold text-gold-400' : 'dark:text-gray-300'}>{stock}</span>
                  </td>
                  <td className="p-3">
                    <span className={`badge ${STATUS_COLORS[status]} text-white`}>{STATUS_LABELS[status]}</span>
                  </td>
                  <td className="p-3">
                    <button onClick={() => patch(p.id, { is_bestseller: !p.is_bestseller }, p.is_bestseller ? 'Retiré des vedettes.' : 'Ajouté aux vedettes.')}>
                      <Star size={16} className={p.is_bestseller ? 'fill-gold-400 text-gold-400' : 'text-charcoal-700/30 dark:text-gray-600'} />
                    </button>
                  </td>
                  <td className="p-3 text-xs text-charcoal-700 dark:text-gray-500">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/produits/${p.id}/modifier`} className="rounded-full p-1.5 hover:bg-blush-100 dark:hover:bg-admin-surface" title="Modifier">
                        <Pencil size={16} />
                      </Link>
                      <DropdownMenu
                        actions={[
                          { label: 'Dupliquer', icon: <Copy size={14} />, onClick: () => handleDuplicate(p) },
                          status === 'active'
                            ? { label: 'Masquer', icon: <EyeOff size={14} />, onClick: () => patch(p.id, { status: 'hidden', is_active: false }, 'Produit masqué.') }
                            : { label: 'Activer', icon: <Eye size={14} />, onClick: () => patch(p.id, { status: 'active', is_active: true }, 'Produit activé.') },
                          { label: 'Mettre en promotion', icon: <Tag size={14} />, onClick: () => setPromoTarget(p) },
                          { label: 'Archiver', icon: <EyeOff size={14} />, onClick: () => patch(p.id, { status: 'archived', is_active: false }, 'Produit archivé.') },
                          { label: 'Supprimer', icon: <Trash2 size={14} />, onClick: () => setDeleteTarget(p), danger: true },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-center text-charcoal-700 dark:text-gray-400">Aucun produit trouvé.</p>}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Dialog suppression */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer ce produit ?"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary !px-4 !py-2 text-sm">Annuler</button>
            <button onClick={() => confirmDelete('archive')} className="rounded-full bg-gold-400 px-4 py-2 text-sm font-semibold text-white">Archiver</button>
            <button onClick={() => confirmDelete('permanent')} className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">Supprimer définitivement</button>
          </>
        }
      >
        <p><strong>{deleteTarget?.name_fr}</strong> — cette action est-elle définitive ou souhaitez-vous simplement l'archiver (récupérable plus tard, non visible en boutique) ?</p>
      </Dialog>

      {/* Dialog promotion rapide */}
      {promoTarget && (
        <PromoDialog
          product={promoTarget}
          onClose={() => setPromoTarget(null)}
          onSaved={(price, oldPrice) => {
            patch(promoTarget.id, { price, old_price: oldPrice }, 'Promotion appliquée.');
            setPromoTarget(null);
          }}
        />
      )}
    </div>
  );
}

function PromoDialog({ product, onClose, onSaved }: { product: Product; onClose: () => void; onSaved: (price: number, oldPrice: number) => void }) {
  const [price, setPrice] = useState(product.price.toString());
  const [oldPrice, setOldPrice] = useState((product.old_price ?? product.price).toString());
  const discount = discountPercent(Number(price), Number(oldPrice));

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Promotion — ${product.name_fr}`}
      footer={
        <>
          <button onClick={onClose} className="btn-secondary !px-4 !py-2 text-sm">Annuler</button>
          <button onClick={() => onSaved(Number(price), Number(oldPrice))} className="btn-primary !px-4 !py-2 text-sm">Appliquer</button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Ancien prix (barré)</label>
          <input type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nouveau prix</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface" />
        </div>
        {discount && <p className="text-sm font-semibold text-rosegold-500">Badge affiché : -{discount}%</p>}
      </div>
    </Dialog>
  );
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
