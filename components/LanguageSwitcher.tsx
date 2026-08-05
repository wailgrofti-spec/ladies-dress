'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

// Ordre d'affichage voulu : FR | EN | العربية
const LANGS: { code: string; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'العربية' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    const segments = pathname.split('/');
    segments[1] = next; // le 1er segment est la locale grâce au middleware
    router.push(segments.join('/'));
  }

  return (
    <div className="flex items-center justify-center gap-1.5 text-[11px] tracking-wide text-charcoal-700/70">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-charcoal-700/30">|</span>}
          <button
            onClick={() => switchTo(l.code)}
            className={`transition-colors ${
              l.code === locale ? 'font-semibold text-rosegold-500' : 'hover:text-charcoal-800'
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
