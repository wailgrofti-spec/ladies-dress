'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    { href: `/${locale}/faq`, label: t('faq') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-blush-200 bg-blush-50/95 backdrop-blur">
      {/* --- Mobile bar (fine, gain de place) --- */}
      <div className="relative flex h-12 items-center justify-between px-3 md:hidden">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="rounded-full p-1.5 hover:bg-blush-200"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <SearchBox />
        </div>

        <Link href={`/${locale}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image src="/images/logo.png" alt="Ladies Dress" width={44} height={37} className="h-9 w-auto object-contain" priority />
        </Link>

        <div className="flex items-center gap-0.5">
          <Link href={`/${locale}/favoris`} className="relative rounded-full p-1.5 hover:bg-blush-200" aria-label="Favoris">
            <Heart size={19} className="text-charcoal-800" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rosegold-400 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href={`/${locale}/panier`} className="relative rounded-full p-1.5 hover:bg-blush-200" aria-label={t('cart')}>
            <ShoppingBag size={19} className="text-charcoal-800" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rosegold-400 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* --- Desktop bar (inchangée) --- */}
      <div className="container-app hidden h-16 items-center justify-between md:flex">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Ladies Dress" width={56} height={47} className="h-12 w-auto object-contain" priority />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-charcoal-700 hover:text-rosegold-500">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchBox />
          <Link href={`/${locale}/favoris`} className="relative rounded-full p-2 hover:bg-blush-200" aria-label="Favoris">
            <Heart size={22} className="text-charcoal-800" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rosegold-400 text-[11px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href={`/${locale}/panier`} className="relative rounded-full p-2 hover:bg-blush-200" aria-label={t('cart')}>
            <ShoppingBag size={22} className="text-charcoal-800" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rosegold-400 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* --- Barre de langue : très discrète, sans drapeaux, sans fond --- */}
      <div className="border-t border-blush-200/70 py-1">
        <LanguageSwitcher />
      </div>

      {/* --- Menu mobile déroulant --- */}
      {open && (
        <nav className="border-t border-blush-200 bg-blush-50 md:hidden">
          <div className="flex flex-col gap-1 px-3 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-charcoal-800 hover:bg-blush-200"
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
