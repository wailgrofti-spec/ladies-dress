import { MetadataRoute } from 'next';
import { getProducts, getCategories } from '@/lib/data';
import { locales } from '@/i18n';

const STATIC_PATHS = [
  '', 'boutique', 'a-propos', 'contact', 'faq', 'guide-des-tailles',
  'livraison', 'echange-retour', 'cgv', 'confidentialite', 'suivi-commande',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ladiesdress.ma';
  const products = await getProducts();
  const categories = await getCategories();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    STATIC_PATHS.forEach((path) => {
      entries.push({
        url: `${siteUrl}/${locale}${path ? `/${path}` : ''}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.6,
      });
    });

    categories.forEach((c) => {
      entries.push({
        url: `${siteUrl}/${locale}/boutique/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
    });

    products.forEach((p) => {
      entries.push({
        url: `${siteUrl}/${locale}/produit/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  }

  return entries;
}
