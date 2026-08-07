// Réglages SEO par défaut du site (utilisés dans app/layout.tsx).
// La partie "par page" (titre/description spécifiques à un produit, une
// catégorie...) reste définie dans chaque page via generateMetadata.
export const seoSettings = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ladiesdress.ma',
  defaultTitle: 'Ladies Dress — Chaussures pour femmes au Maroc',
  titleTemplate: '%s — Ladies Dress',
  defaultDescription: 'Ladies Dress : chaussures pour femmes tendance, livraison partout au Maroc, paiement à la livraison.',
  ogLocale: 'fr_MA',
};
