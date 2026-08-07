import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProductBySlug, getProducts } from '@/lib/data';
import ProductDetail from '@/components/ProductDetail';
import ProductCard from '@/components/ProductCard';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ladiesdress.ma';
  const path = `/${params.locale}/produit/${product.slug}`;

  return {
    title: `${product.name_fr} — Ladies Dress`,
    description: product.description_fr.slice(0, 150),
    alternates: {
      canonical: `${siteUrl}${path}`,
      languages: {
        fr: `${siteUrl}/fr/produit/${product.slug}`,
        ar: `${siteUrl}/ar/produit/${product.slug}`,
        en: `${siteUrl}/en/produit/${product.slug}`,
      },
    },
    openGraph: {
      title: product.name_fr,
      description: product.description_fr.slice(0, 150),
      images: product.images[0] ? [product.images[0].url] : [],
      url: `${siteUrl}${path}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name_fr,
      description: product.description_fr.slice(0, 150),
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const t = await getTranslations('product');
  const allProducts = await getProducts();
  const similar = allProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ladiesdress.ma';
  const url = `${siteUrl}/${params.locale}/produit/${product.slug}`;

  // Données structurées pour le SEO (Google Shopping / rich results)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_fr,
    description: product.description_fr,
    image: product.images.map((i) => i.url),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MAD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url,
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} url={url} />

      {similar.length > 0 && (
        <section className="container-app pb-14">
          <h2 className="font-display text-2xl font-semibold text-charcoal-900">{t('similar')}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
