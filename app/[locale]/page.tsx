import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/lib/data';
import { buildWhatsappLink } from '@/lib/whatsapp';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import Categories from '@/components/home/Categories';
import NewArrivals from '@/components/home/NewArrivals';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ladiesdress.ma';
  return {
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: { fr: `${siteUrl}/fr`, ar: `${siteUrl}/ar`, en: `${siteUrl}/en` },
    },
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('home');
  const products = await getProducts();

  return (
    <div className="bg-[#FDF6F4] min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* 1. Hero bannière principale */}
        <Hero locale={locale} />

        {/* 2. Barre d'informations (livraison, paiement, disponibilité) */}
        <TrustBar />

        {/* 3. Nos catégories */}
        <Categories locale={locale} />

        {/* 4. Nouveautés */}
        <NewArrivals products={products} locale={locale} />
      </div>
    </div>
  );
}
