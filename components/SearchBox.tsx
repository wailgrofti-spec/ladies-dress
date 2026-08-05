'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Search, X, Loader2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function SearchBox() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((data) => setResults(data.results))
        .finally(() => setLoading(false));
    }, 250); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  function localizedName(p: Product) {
    if (locale === 'ar') return p.name_ar;
    if (locale === 'en') return p.name_en;
    return p.name_fr;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Rechercher"
        className="rounded-full p-2 hover:bg-blush-200"
      >
        <Search size={20} className="text-charcoal-800" />
      </button>

      {open && (
        <div className="absolute end-0 top-12 z-50 w-[min(90vw,380px)] rounded-soft bg-white p-3 shadow-card">
          <div className="relative">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-charcoal-700/50" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher (nom, couleur, pointure...)"
              className="w-full rounded-full border border-blush-200 py-2 ps-9 pe-8 text-sm"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute end-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-charcoal-700/50" />
              </button>
            )}
          </div>

          <div className="mt-2 max-h-80 overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-6">
                <Loader2 size={18} className="animate-spin text-rosegold-400" />
              </div>
            )}
            {!loading && query.length >= 2 && results.length === 0 && (
              <p className="py-6 text-center text-sm text-charcoal-700">Aucun résultat.</p>
            )}
            {results.map((p) => {
              const image = p.images.find((i) => i.is_primary) ?? p.images[0];
              return (
                <Link
                  key={p.id}
                  href={`/${locale}/produit/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-blush-50"
                >
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded bg-blush-100">
                    {image && <Image src={image.url} alt={localizedName(p)} fill className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-charcoal-800">{localizedName(p)}</p>
                    <p className="text-xs text-rosegold-500">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
