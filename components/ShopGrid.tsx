'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal, X } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import ProductCard from './ProductCard';

export default function ShopGrid({
  products,
  categories,
  initialCategorySlug,
}: {
  products: Product[];
  categories: Category[];
  initialCategorySlug?: string;
}) {
  const t = useTranslations('shop');
  const tCat = useTranslations('categories');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(initialCategorySlug ?? null);

  const categoryLabel = (slug: string) => {
    try {
      return tCat(slug as any);
    } catch {
      return slug;
    }
  };

  const filtered = useMemo(() => {
    if (!category) return products;
    const cat = categories.find((c) => c.slug === category);
    if (!cat) return products;
    return products.filter((p) => p.category_id === cat.id);
  }, [products, categories, category]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 md:hidden">
        <button
          onClick={() => setFiltersOpen(true)}
          className="btn-secondary !px-4 !py-2"
        >
          <SlidersHorizontal size={16} /> {t('filters')}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        {/* Desktop filter */}
        <aside className="hidden md:block">
          <FilterPanel categories={categories} category={category} setCategory={setCategory} categoryLabel={categoryLabel} t={t} />
        </aside>

        <div>
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-charcoal-700">{t('noResults')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ms-auto h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">{t('filters')}</p>
              <button onClick={() => setFiltersOpen(false)} aria-label="Fermer"><X size={20} /></button>
            </div>
            <FilterPanel categories={categories} category={category} setCategory={setCategory} categoryLabel={categoryLabel} t={t} />
            <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-6 w-full">
              {t('viewProduct')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  categories, category, setCategory, categoryLabel, t,
}: {
  categories: Category[];
  category: string | null;
  setCategory: (c: string | null) => void;
  categoryLabel: (slug: string) => string;
  t: any;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-charcoal-800">{t('category')}</p>
        {category && (
          <button onClick={() => setCategory(null)} className="text-xs text-rosegold-500 underline">
            {t('clearFilters')}
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <FilterRadio label={t('clearFilters')} active={!category} onClick={() => setCategory(null)} />
        {categories.map((c) => (
          <FilterRadio
            key={c.id}
            label={categoryLabel(c.slug)}
            active={category === c.slug}
            onClick={() => setCategory(c.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterRadio({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-start text-sm ${
        active ? 'bg-rosegold-400 text-white' : 'text-charcoal-700 hover:bg-blush-100'
      }`}
    >
      {label}
    </button>
  );
}
