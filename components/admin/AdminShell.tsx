'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, FolderTree, Settings,
  Tag, FileText, LogOut, AlertTriangle, Users, Star, Sun, Moon,
} from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';

const navItems = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { href: '/admin/clients', label: 'Clientes', icon: Users },
  { href: '/admin/categories', label: 'Catégories', icon: FolderTree },
  { href: '/admin/avis', label: 'Avis', icon: Star },
  { href: '/admin/codes-promo', label: 'Codes promo', icon: Tag },
  { href: '/admin/contenu', label: 'Contenu du site', icon: FileText },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('ladiesdress_admin_theme');
    const isDark = stored === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  function toggle() {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      window.localStorage.setItem('ladiesdress_admin_theme', next ? 'dark' : 'light');
      return next;
    });
  }

  return { dark, toggle };
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, isDemoMode, email, logout } = useAdminAuth();
  const { dark, toggle } = useDarkMode();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [loading, isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-blush-100 font-body dark:bg-admin-bg">{children}</div>;
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-blush-100 dark:bg-admin-bg dark:text-white">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-blush-100 dark:bg-admin-bg dark:text-white">Redirection...</div>;
  }

  return (
    <div className="flex min-h-screen bg-blush-50 font-body text-charcoal-800 dark:bg-admin-bg dark:text-gray-100">
      {/* Sidebar (desktop) */}
      <aside className="relative hidden w-64 shrink-0 border-r border-blush-200 bg-white md:block dark:border-admin-border dark:bg-admin-surface">
        <div className="flex items-center justify-between p-5">
          <div>
            <p className="font-display text-lg font-semibold text-rosegold-500">Ladies Dress</p>
            <p className="text-xs text-charcoal-700 dark:text-gray-400">Espace administrateur</p>
          </div>
          <button
            onClick={toggle}
            aria-label="Basculer le mode sombre"
            className="rounded-full p-2 text-charcoal-700 hover:bg-blush-100 dark:text-gray-300 dark:hover:bg-admin-surface2"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-rosegold-400 text-white'
                    : 'text-charcoal-700 hover:bg-blush-100 dark:text-gray-300 dark:hover:bg-admin-surface2'
                }`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-64 border-t border-blush-200 p-4 dark:border-admin-border">
          <p className="truncate text-xs text-charcoal-700 dark:text-gray-400">{email}</p>
          <button onClick={logout} className="mt-2 flex items-center gap-2 text-sm text-charcoal-700 hover:text-rosegold-500 dark:text-gray-300">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-blush-200 bg-white p-4 md:hidden dark:border-admin-border dark:bg-admin-surface">
          <p className="font-display font-semibold text-rosegold-500">Ladies Dress Admin</p>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="rounded-full p-2 hover:bg-blush-100 dark:hover:bg-admin-surface2">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={logout} className="text-sm text-charcoal-700 dark:text-gray-300">Déconnexion</button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-b border-blush-200 bg-white px-2 py-2 md:hidden dark:border-admin-border dark:bg-admin-surface">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                pathname.startsWith(item.href)
                  ? 'bg-rosegold-400 text-white'
                  : 'bg-blush-100 text-charcoal-700 dark:bg-admin-surface2 dark:text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {isDemoMode && (
          <div className="flex items-center gap-2 bg-gold-400/20 px-4 py-2 text-xs text-charcoal-800 dark:text-gray-100">
            <AlertTriangle size={14} className="shrink-0" />
            Mode démo : Supabase n'est pas encore configuré. Les modifications ne sont pas sauvegardées. Voir le README pour connecter votre base de données.
          </div>
        )}

        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
