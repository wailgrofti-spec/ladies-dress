import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ladiesdress.ma';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/*/panier', '/*/commande'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
