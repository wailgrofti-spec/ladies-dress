'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Sparkles } from 'lucide-react';
import { Category, Product } from '@/lib/types';
import { slugify, discountPercent } from '@/lib/utils';
import { useToast } from './ui/Toast';
import ProductImageManager, { ImageRow } from './ProductImageManager';
import ProductVariantsManager, { ColorRow } from './ProductVariantsManager';
import StockHistory from './StockHistory';

const SIZES = ['36', '37', '38', '39', '40', '41'];
const TABS = ['Informations', 'Description', 'SEO', 'Prix', 'Images', 'Variantes'] as const;

export default function ProductForm({
  categories,
  existing,
}: {
  categories: Category[];
  existing?: Product;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number] | 'Historique'>('Informations');

  // Informations
  const [nameFr, setNameFr] = useState(existing?.name_fr ?? '');
  const [nameAr, setNameAr] = useState(existing?.name_ar ?? '');
  const [nameEn, setNameEn] = useState(existing?.name_en ?? '');
  const [categoryId, setCategoryId] = useState(existing?.category_id ?? categories[0]?.id ?? '');
  const [brand, setBrand] = useState(existing?.brand ?? 'Ladies Dress');
  const [material, setMaterial] = useState(existing?.material ?? '');
  const [weight, setWeight] = useState(existing?.weight_grams?.toString() ?? '');
  const [sku, setSku] = useState(existing?.sku ?? '');
  const [slug, setSlug] = useState(existing?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!existing);
  const [isNew, setIsNew] = useState(existing?.is_new ?? false);
  const [isBestseller, setIsBestseller] = useState(existing?.is_bestseller ?? false);
  const [status, setStatus] = useState(existing?.status ?? 'active');

  // Description
  const [descFr, setDescFr] = useState(existing?.description_fr ?? '');
  const [descAr, setDescAr] = useState(existing?.description_ar ?? '');
  const [descEn, setDescEn] = useState(existing?.description_en ?? '');

  // SEO
  const [metaTitle, setMetaTitle] = useState(existing?.meta_title ?? '');
  const [metaDescription, setMetaDescription] = useState(existing?.meta_description ?? '');

  // Prix
  const [price, setPrice] = useState(existing?.price?.toString() ?? '');
  const [oldPrice, setOldPrice] = useState(existing?.old_price?.toString() ?? '');

  // Images
  const [images, setImages] = useState<ImageRow[]>(
    existing?.images.map((i) => ({ url: i.url, isPrimary: i.is_primary })) ?? []
  );

  // Variantes
  const initialColors: ColorRow[] = existing
    ? Array.from(new Set(existing.variants.map((v) => v.color_name))).map((name) => {
        const variant = existing.variants.find((v) => v.color_name === name)!;
        const stockBySize: Record<string, number> = {};
        const skuBySize: Record<string, string> = {};
        const idBySize: Record<string, string> = {};
        SIZES.forEach((s) => {
          const v = existing.variants.find((vv) => vv.color_name === name && vv.size === s);
          stockBySize[s] = v?.stock_quantity ?? 0;
          skuBySize[s] = v?.sku ?? '';
          if (v) idBySize[s] = v.id;
        });
        return { name, hex: variant.color_hex, imageUrl: variant.color_image_url ?? undefined, stockBySize, skuBySize, idBySize };
      })
    : [{ name: '', hex: '#000000', stockBySize: Object.fromEntries(SIZES.map((s) => [s, 0])), skuBySize: Object.fromEntries(SIZES.map((s) => [s, ''])) }];
  const [colors, setColors] = useState<ColorRow[]>(initialColors);

  const [saving, setSaving] = useState(false);
  const discount = discountPercent(Number(price || 0), oldPrice ? Number(oldPrice) : null);

  function handleNameChange(value: string) {
    setNameFr(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function fillSeoDefaults() {
    setMetaTitle(`${nameFr} — Ladies Dress`);
    setMetaDescription(descFr.slice(0, 155) || `Découvrez ${nameFr} chez Ladies Dress, livraison partout au Maroc.`);
    toast('Champs SEO pré-remplis automatiquement.', 'info');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameFr || !price) {
      toast('Le nom et le prix sont obligatoires.', 'error');
      setTab('Informations');
      return;
    }
    setSaving(true);

    const variants = colors
      .filter((c) => c.name.trim())
      .flatMap((c) =>
        SIZES.map((size) => ({
          color_name: c.name,
          color_hex: c.hex,
          color_image_url: c.imageUrl || null,
          size,
          sku: c.skuBySize[size] || null,
          stock_quantity: c.stockBySize[size] ?? 0,
          is_active: true,
        }))
      );

    const payload = {
      category_id: categoryId,
      slug: slug || slugify(nameFr),
      name_fr: nameFr, name_ar: nameAr || nameFr, name_en: nameEn || nameFr,
      description_fr: descFr, description_ar: descAr || descFr, description_en: descEn || descFr,
      material, brand, weight_grams: weight ? Number(weight) : null, sku: sku || null,
      price: Number(price), old_price: oldPrice ? Number(oldPrice) : null,
      is_new: isNew, is_bestseller: isBestseller, status, is_active: status === 'active',
      meta_title: metaTitle, meta_description: metaDescription,
      variants,
      images: images.map((img) => ({ url: img.url, is_primary: img.isPrimary, alt_text_fr: nameFr, alt_text_ar: nameAr, alt_text_en: nameEn })),
    };

    const res = await fetch(existing ? `/api/products/${existing.id}` : '/api/products', {
      method: existing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (data.demo) {
      toast(data.message, 'info');
    } else {
      toast(existing ? 'Produit mis à jour.' : 'Produit créé.', 'success');
      router.push('/admin/produits');
      router.refresh();
    }
  }

  const tabs = existing ? [...TABS, 'Historique' as const] : TABS;

  return (
    <form onSubmit={handleSubmit}>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-blush-200 dark:border-admin-border">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t ? 'text-rosegold-500' : 'text-charcoal-700 hover:text-charcoal-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {t}
            {tab === t && <motion.div layoutId="tab-underline" className="absolute inset-x-2 -bottom-px h-0.5 bg-rosegold-400" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="py-6"
        >
          {tab === 'Informations' && (
            <div className="card space-y-4 p-5 dark:bg-admin-surface2">
              <div className="grid gap-4 sm:grid-cols-3">
                <TextField label="Nom (français) *" value={nameFr} onChange={handleNameChange} required />
                <TextField label="Nom (arabe)" value={nameAr} onChange={setNameAr} dir="rtl" />
                <TextField label="Nom (anglais)" value={nameEn} onChange={setNameEn} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-charcoal-800 dark:text-gray-200">URL (slug)</label>
                  <input
                    value={slug}
                    onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
                    className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100"
                  />
                </div>
                <TextField label="SKU produit (référence)" value={sku} onChange={setSku} placeholder="LD-SNK-001" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-charcoal-800 dark:text-gray-200">Catégorie</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
                  </select>
                </div>
                <TextField label="Marque" value={brand} onChange={setBrand} />
                <TextField label="Matière" value={material} onChange={setMaterial} />
              </div>
              <TextField label="Poids (grammes)" value={weight} onChange={setWeight} type="number" />
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="accent-rosegold-400" /> Nouveauté
                </label>
                <label className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <input type="checkbox" checked={isBestseller} onChange={(e) => setIsBestseller(e.target.checked)} className="accent-rosegold-400" /> Vedette / meilleure vente
                </label>
                <div className="flex items-center gap-2 text-sm dark:text-gray-200">
                  <span>Statut :</span>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-lg border border-blush-200 px-2 py-1 text-sm dark:border-admin-border dark:bg-admin-surface">
                    <option value="active">Actif</option>
                    <option value="hidden">Masqué</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {tab === 'Description' && (
            <div className="card space-y-4 p-5 dark:bg-admin-surface2">
              <TextArea label="Description (français)" value={descFr} onChange={setDescFr} />
              <TextArea label="Description (arabe)" value={descAr} onChange={setDescAr} dir="rtl" />
              <TextArea label="Description (anglais)" value={descEn} onChange={setDescEn} />
            </div>
          )}

          {tab === 'SEO' && (
            <div className="card space-y-4 p-5 dark:bg-admin-surface2">
              <button type="button" onClick={fillSeoDefaults} className="btn-secondary !px-3 !py-1.5 text-xs">
                <Sparkles size={14} /> Pré-remplir automatiquement
              </button>
              <TextField label="Meta Title" value={metaTitle} onChange={setMetaTitle} />
              <TextArea label="Meta Description" value={metaDescription} onChange={setMetaDescription} rows={2} />
              <p className="text-xs text-charcoal-700 dark:text-gray-500">
                Ces champs contrôlent l'aperçu du produit dans les résultats Google et les partages
                sur les réseaux sociaux.
              </p>
            </div>
          )}

          {tab === 'Prix' && (
            <div className="card space-y-4 p-5 dark:bg-admin-surface2">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Prix actuel (DH) *" value={price} onChange={setPrice} type="number" required />
                <TextField label="Ancien prix (DH, optionnel)" value={oldPrice} onChange={setOldPrice} type="number" />
              </div>
              {discount ? (
                <div className="flex items-center gap-2">
                  <span className="badge bg-rosegold-400 text-white">-{discount}%</span>
                  <span className="text-sm text-charcoal-700 dark:text-gray-400">Badge de réduction calculé automatiquement</span>
                </div>
              ) : (
                <p className="text-sm text-charcoal-700 dark:text-gray-500">
                  Renseignez un ancien prix supérieur au prix actuel pour afficher un badge de promotion.
                </p>
              )}
            </div>
          )}

          {tab === 'Images' && (
            <div className="card p-5 dark:bg-admin-surface2">
              <ProductImageManager images={images} onChange={setImages} />
            </div>
          )}

          {tab === 'Variantes' && (
            <div className="card p-5 dark:bg-admin-surface2">
              <ProductVariantsManager
                colors={colors}
                onChange={setColors}
                availableImages={images.map((i) => i.url)}
                productId={existing?.id}
                baseSku={sku}
              />
            </div>
          )}

          {tab === 'Historique' && existing && (
            <div className="card p-5 dark:bg-admin-surface2">
              <StockHistory productId={existing.id} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
        <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer le produit'}
      </button>
    </form>
  );
}

function TextField({
  label, value, onChange, required, type = 'text', dir, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; dir?: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-charcoal-800 dark:text-gray-200">{label}</label>
      <input
        type={type}
        dir={dir as any}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, dir, rows = 4,
}: { label: string; value: string; onChange: (v: string) => void; dir?: string; rows?: number }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-charcoal-800 dark:text-gray-200">{label}</label>
      <textarea
        dir={dir as any}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-blush-200 px-3 py-2.5 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100"
      />
    </div>
  );
}
