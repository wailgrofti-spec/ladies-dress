import type { Metadata } from 'next';
import { Playfair_Display, Inter, Noto_Kufi_Arabic } from 'next/font/google';
import './globals.css';

// Polices — chargées une seule fois au niveau racine.
const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const arabic = Noto_Kufi_Arabic({ subsets: ['arabic'], variable: '--font-arabic', weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ladiesdress.ma'),
  title: {
    default: 'Ladies Dress — Chaussures pour femmes au Maroc',
    template: '%s — Ladies Dress',
  },
  description: 'Ladies Dress : chaussures pour femmes tendance, livraison partout au Maroc, paiement à la livraison.',
  openGraph: {
    siteName: 'Ladies Dress',
    type: 'website',
    locale: 'fr_MA',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
