'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Minus, ImageIcon } from 'lucide-react';
import { useToast } from './ui/Toast';

const SIZES = ['36', '37', '38', '39', '40', '41'];

export interface ColorRow {
  name: string;
  hex: string;
  imageUrl?: string;
  stockBySize: Record<string, number>;
  skuBySize: Record<string, string>;
  idBySize?: Record<string, string>; // ids réels des variantes existantes (pour l'ajustement de stock)
}

export default function ProductVariantsManager({
  colors, onChange, availableImages, productId, baseSku,
}: {
  colors: ColorRow[];
  onChange: (colors: ColorRow[]) => void;
  availableImages: string[];
  productId?: string; // présent uniquement en mode édition
  baseSku?: string;
}) {
  const { toast } = useToast();
  const [adjusting, setAdjusting] = useState<string | null>(null);

  function addColor() {
    onChange([
      ...colors,
      {
        name: '', hex: '#000000',
        stockBySize: Object.fromEntries(SIZES.map((s) => [s, 0])),
        skuBySize: Object.fromEntries(SIZES.map((s) => [s, ''])),
      },
    ]);
  }
  function removeColor(index: number) {
    onChange(colors.filter((_, i) => i !== index));
  }
  function updateColor(index: number, field: 'name' | 'hex' | 'imageUrl', value: string) {
    onChange(colors.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }
  function updateStock(index: number, size: string, value: number) {
    onChange(colors.map((row, i) => (i === index ? { ...row, stockBySize: { ...row.stockBySize, [size]: Math.max(0, value) } } : row)));
  }
  function updateSku(index: number, size: string, value: string) {
    onChange(colors.map((row, i) => (i === index ? { ...row, skuBySize: { ...row.skuBySize, [size]: value } } : row)));
  }
  function autoGenerateSkus(index: number, colorName: string) {
    const prefix = baseSku || 'LD';
    const colorCode = colorName.slice(0, 3).toUpperCase() || 'COL';
    onChange(colors.map((row, i) => {
      if (i !== index) return row;
      const skuBySize: Record<string, string> = {};
      SIZES.forEach((s) => { skuBySize[s] = `${prefix}-${colorCode}-${s}`; });
      return { ...row, skuBySize };
    }));
  }

  // Ajustement rapide du stock (produit déjà existant en base uniquement)
  async function quickAdjust(variantId: string | undefined, index: number, size: string, delta: number) {
    if (!variantId || !productId) {
      // Produit pas encore enregistré : on modifie juste la valeur locale
      updateStock(index, size, (colors[index].stockBySize[size] ?? 0) + delta);
      return;
    }
    setAdjusting(`${index}-${size}`);
    const res = await fetch(`/api/products/${productId}/stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId, change: delta, reason: 'manuel' }),
    });
    const data = await res.json();
    setAdjusting(null);
    if (data.demo) {
      toast(data.message, 'info');
      updateStock(index, size, (colors[index].stockBySize[size] ?? 0) + delta);
    } else {
      updateStock(index, size, data.newStock);
      toast('Stock mis à jour.', 'success');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-charcoal-800 dark:text-gray-200">Couleurs, pointures, stock et SKU</p>
        <button type="button" onClick={addColor} className="btn-secondary !px-3 !py-1.5 text-xs"><Plus size={14} /> Couleur</button>
      </div>

      {colors.map((c, i) => (
        <div key={i} className="rounded-lg border border-blush-200 p-4 dark:border-admin-border">
          <div className="flex flex-wrap items-center gap-3">
            <input type="color" value={c.hex} onChange={(e) => updateColor(i, 'hex', e.target.value)} className="h-9 w-9 rounded" />
            <input
              placeholder="Nom de la couleur"
              value={c.name}
              onChange={(e) => updateColor(i, 'name', e.target.value)}
              className="flex-1 rounded-lg border border-blush-200 px-3 py-2 text-sm dark:border-admin-border dark:bg-admin-surface dark:text-gray-100"
            />

            {/* Image spécifique à la couleur */}
            <div className="flex items-center gap-2">
              {c.imageUrl ? (
                <div className="relative h-9 w-9 overflow-hidden rounded-lg">
                  <Image src={c.imageUrl} alt="" fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blush-100 dark:bg-admin-surface">
                  <ImageIcon size={14} className="text-charcoal-700/40" />
                </div>
              )}
              <select
                value={c.imageUrl || ''}
                onChange={(e) => updateColor(i, 'imageUrl', e.target.value)}
                className="rounded-lg border border-blush-200 px-2 py-2 text-xs dark:border-admin-border dark:bg-admin-surface dark:text-gray-100"
              >
                <option value="">Image de la couleur...</option>
                {availableImages.map((url, idx) => (
                  <option key={url} value={url}>Photo {idx + 1}</option>
                ))}
              </select>
            </div>

            <button type="button" onClick={() => autoGenerateSkus(i, c.name)} className="text-xs text-rosegold-500 underline">
              Générer les SKU
            </button>
            <button type="button" onClick={() => removeColor(i)}><Trash2 size={16} className="text-red-500" /></button>
          </div>

          <div className="mt-3 space-y-2">
            {SIZES.map((s) => {
              const variantId = c.idBySize?.[s];
              const isAdjusting = adjusting === `${i}-${s}`;
              return (
                <div key={s} className="flex items-center gap-2 rounded-lg bg-blush-50 p-2 text-sm dark:bg-admin-surface">
                  <span className="w-8 shrink-0 text-center font-medium">{s}</span>
                  <input
                    placeholder="SKU"
                    value={c.skuBySize[s] ?? ''}
                    onChange={(e) => updateSku(i, s, e.target.value)}
                    className="w-32 rounded border border-blush-200 px-2 py-1 text-xs dark:border-admin-border dark:bg-admin-surface2"
                  />
                  <div className="ms-auto flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isAdjusting}
                      onClick={() => quickAdjust(variantId, i, s, -1)}
                      className="rounded-full border border-blush-200 p-1 hover:bg-white disabled:opacity-40 dark:border-admin-border"
                    >
                      <Minus size={12} />
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={c.stockBySize[s] ?? 0}
                      onChange={(e) => updateStock(i, s, Number(e.target.value))}
                      className="w-14 rounded border border-blush-200 px-1 py-1 text-center text-xs dark:border-admin-border dark:bg-admin-surface2"
                    />
                    <button
                      type="button"
                      disabled={isAdjusting}
                      onClick={() => quickAdjust(variantId, i, s, 1)}
                      className="rounded-full border border-blush-200 p-1 hover:bg-white disabled:opacity-40 dark:border-admin-border"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {productId && (
        <p className="text-xs text-charcoal-700 dark:text-gray-500">
          Les boutons +/- ajustent le stock immédiatement et sont journalisés dans l'historique des
          mouvements. Les champs numériques modifient la valeur qui sera enregistrée au clic sur
          "Enregistrer le produit".
        </p>
      )}
    </div>
  );
}
