import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const about = [
    { href: `/${locale}/a-propos`, label: t('about') },
    { href: `/${locale}/contact`, label: 'Contact' },
    { href: `/${locale}/faq`, label: 'FAQ' },
  ];
  const help = [
    { href: `/${locale}/guide-des-tailles`, label: 'Guide des tailles' },
    { href: `/${locale}/livraison`, label: 'Livraison' },
    { href: `/${locale}/echange-retour`, label: 'Échange & retour' },
    { href: `/${locale}/suivi-commande`, label: 'Suivi de commande' },
  ];
  const legal = [
    { href: `/${locale}/cgv`, label: 'CGV' },
    { href: `/${locale}/confidentialite`, label: 'Confidentialité' },
  ];

  return (
    <footer className="mt-16 border-t border-blush-200 bg-white">
      <div className="container-app grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-lg font-semibold text-rosegold-500">Ladies Dress</p>
          <p className="mt-2 text-sm text-charcoal-700">
            Chaussures pour femmes, livrées partout au Maroc.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full bg-blush-100 p-2 hover:bg-blush-200">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full bg-blush-100 p-2 hover:bg-blush-200">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <FooterCol title={t('about')} links={about} />
        <FooterCol title={t('help')} links={help} />
        <FooterCol title={t('legal')} links={legal} />
      </div>

      <div className="border-t border-blush-200 py-4 text-center text-xs text-charcoal-700">
        © {new Date().getFullYear()} Ladies Dress — {t('rights')}
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-charcoal-800">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-charcoal-700 hover:text-rosegold-500">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
