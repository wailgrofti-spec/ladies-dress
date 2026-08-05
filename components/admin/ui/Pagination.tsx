'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg p-2 hover:bg-blush-100 disabled:opacity-30 dark:hover:bg-admin-surface"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-charcoal-700/40">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`h-8 w-8 rounded-lg text-sm font-medium ${
              p === page
                ? 'bg-rosegold-400 text-white'
                : 'text-charcoal-700 hover:bg-blush-100 dark:text-gray-300 dark:hover:bg-admin-surface'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg p-2 hover:bg-blush-100 disabled:opacity-30 dark:hover:bg-admin-surface"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
