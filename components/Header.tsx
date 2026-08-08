'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import LanguageSwitcher from './LanguageSwitcher';
import SearchBox from './SearchBox';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/boutique`, label: t('shop') },
    { href: `/${locale}/a-propos`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDF6F4]/97 backdrop-blur-sm" style={{ borderBottom: '1px solid #F0DDD9' }}>
      {/* ── Mobile bar ── */}
      <div className="relative flex h-14 items-center justify-between px-3 md:hidden">
        {/* Gauche : hamburger + loupe */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="rounded-full p-1.5 hover:bg-[#F5E4E0] transition-colors"
          >
            {open ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
          </button>
          <SearchBox />
        </div>

        {/* Centre : logo texte élégant */}
        <Link
          href={`/${locale}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0"
        >
          <span
            className="font-display leading-none tracking-wide text-[#7D3E3E]"
            style={{ fontSize: '1.35rem', fontWeight: 600, letterSpacing: '0.04em' }}
          >
            Ladies Dress
          </span>
          <span
            className="font-body text-[10px] tracking-widest text-[#A0706A]/80 mt-0.5"
            style={{ letterSpacing: '0.18em' }}
          >
            Walk with elegance
          </span>
          {/* Petite décoration */}
          <span className="text-[#C98374] text-[8px] leading-none">♥</span>
        </Link>

        {/* Droite : cœur + panier */}
        <div className="flex items-center gap-0.5">
          <Link
            href={`/${locale}/favoris`}
            className="relative rounded-full p-1.5 hover:bg-[#F5E4E0] transition-colors"
            aria-label="Favoris"
          >
            <Heart size={19} strokeWidth={1.8} className="text-[#2E2A27]" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C98374] text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href={`/${locale}/panier`}
            className="relative rounded-full p-1.5 hover:bg-[#F5E4E0] transition-colors"
            aria-label={t('cart')}
          >
            <ShoppingBag size={19} strokeWidth={1.8} className="text-[#2E2A27]" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C98374] text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── Desktop bar ── */}
      <div className="container-app hidden h-20 items-center justify-between md:flex">
        <Link href={`/${locale}`} className="flex flex-col items-start">
          <span
            className="font-display text-[#7D3E3E] leading-none"
            style={{ fontSize: '1.6rem', fontWeight: 600, letterSpacing: '0.03em' }}
          >
            Ladies Dress
          </span>
          <span className="font-body text-[10px] tracking-widest text-[#A0706A]/80 mt-0.5" style={{ letterSpacing: '0.16em' }}>
            Walk with elegance
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#3A332F] hover:text-[#C98374] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchBox />
          <Link href={`/${locale}/favoris`} className="relative rounded-full p-2 hover:bg-[#F5E4E0] transition-colors" aria-label="Favoris">
            <Heart size={22} strokeWidth={1.8} className="text-[#2E2A27]" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C98374] text-[11px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href={`/${locale}/panier`} className="relative rounded-full p-2 hover:bg-[#F5E4E0] transition-colors" aria-label={t('cart')}>
            <ShoppingBag size={22} strokeWidth={1.8} className="text-[#2E2A27]" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#C98374] text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── Barre de langue ── */}
      <div style={{ borderTop: '1px solid #F0DDD9' }} className="py-1">
        <LanguageSwitcher />
      </div>

      {/* ── Menu mobile déroulant ── */}
      {open && (
        <nav style={{ borderTop: '1px solid #F0DDD9' }} className="bg-[#FDF6F4] md:hidden">
          <div className="flex flex-col gap-1 px-3 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-[#2E2A27] hover:bg-[#F5E4E0] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
