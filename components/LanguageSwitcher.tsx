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
    <div className="flex items-center justify-center gap-2.5 text-[10px] tracking-widest uppercase font-medium">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2.5">
          {i > 0 && <span className="text-[#1A1A1A]/20">|</span>}
          <button
            onClick={() => switchTo(l.code)}
            className={`transition-colors ${
              l.code === locale ? 'font-bold text-[#1A1A1A]' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70'
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
