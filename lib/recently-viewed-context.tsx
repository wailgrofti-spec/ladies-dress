'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface RecentlyViewedContextValue {
  slugs: string[];
  addView: (slug: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);
const STORAGE_KEY = 'ladiesdress_recently_viewed';
const MAX_ITEMS = 8;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {}
  }, [slugs, hydrated]);

  function addView(slug: string) {
    setSlugs((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_ITEMS));
  }

  return (
    <RecentlyViewedContext.Provider value={{ slugs, addView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return ctx;
}
