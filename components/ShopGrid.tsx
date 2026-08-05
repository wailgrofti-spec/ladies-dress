'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal, X } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { totalStock, availableColors } from '@/lib/data';
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
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState<'newest' | 'priceAsc' | 'priceDesc' | 'popular'>('newest');

  const categoryLabel = (slug: string) => {
    try {
      return tCat(slug as any);
    } catch {
      return slug;
    }
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);

    if (category) {
      const cat = categories.find((c) => c.slug === category);
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }
    if (onlyNew) list = list.filter((p) => p.is_new);
    if (onlyPromo) list = list.filter((p) => p.old_price);
    if (onlyAvailable) list = list.filter((p) => totalStock(p) > 0);

    switch (sort) {
      case 'priceAsc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        list = [...list].sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.is_new) - Number(a.is_new));
    }
    return list;
  }, [products, categories, category, maxPrice, onlyNew, onlyPromo, onlyAvailable, sort]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setFiltersOpen(true)}
          className="btn-secondary !px-4 !py-2 md:hidden"
        >
          <SlidersHorizontal size={16} /> {t('filters')}
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="ms-auto rounded-full border border-blush-200 bg-white px-4 py-2 text-sm"
        >
          <option value="newest">{t('sortNewest')}</option>
          <option value="priceAsc">{t('sortPriceAsc')}</option>
          <option value="priceDesc">{t('sortPriceDesc')}</option>
          <option value="popular">{t('sortPopular')}</option>
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden md:block">
          <FiltersPanel
            categories={categories}
            category={category}
            setCategory={setCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onlyNew={onlyNew}
            setOnlyNew={setOnlyNew}
            onlyPromo={onlyPromo}
            setOnlyPromo={setOnlyPromo}
            onlyAvailable={onlyAvailable}
            setOnlyAvailable={setOnlyAvailable}
            categoryLabel={categoryLabel}
            t={t}
          />
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

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ms-auto h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold">{t('filters')}</p>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            <FiltersPanel
              categories={categories}
              category={category}
              setCategory={setCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onlyNew={onlyNew}
              setOnlyNew={setOnlyNew}
              onlyPromo={onlyPromo}
              setOnlyPromo={setOnlyPromo}
              onlyAvailable={onlyAvailable}
              setOnlyAvailable={setOnlyAvailable}
              categoryLabel={categoryLabel}
              t={t}
            />
            <button onClick={() => setFiltersOpen(false)} className="btn-primary mt-4 w-full">
              {t('viewProduct')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FiltersPanel(props: any) {
  const {
    categories, category, setCategory, maxPrice, setMaxPrice,
    onlyNew, setOnlyNew, onlyPromo, setOnlyPromo, onlyAvailable, setOnlyAvailable,
    categoryLabel, t,
  } = props;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-charcoal-800">{t('category')}</p>
        <div className="flex flex-col gap-1">
          <FilterRadio label={t('clearFilters')} active={!category} onClick={() => setCategory(null)} />
          {categories.map((c: Category) => (
            <FilterRadio
              key={c.id}
              label={categoryLabel(c.slug)}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-charcoal-800">{t('price')}</p>
        <input
          type="range"
          min={100}
          max={600}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-rosegold-400"
        />
        <p className="text-xs text-charcoal-700">≤ {maxPrice} DH</p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} className="accent-rosegold-400" />
          Nouveautés
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyPromo} onChange={(e) => setOnlyPromo(e.target.checked)} className="accent-rosegold-400" />
          Promotions
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="accent-rosegold-400" />
          {t('availability')}
        </label>
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
