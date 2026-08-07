import { Category } from '../types';
import { img } from './_helpers';

// Source unique des catégories. Pour ajouter, renommer ou supprimer une
// catégorie plus tard, c'est ICI et seulement ici (tant que Supabase n'est
// pas connecté — une fois connecté, la table `categories` prend le relais
// automatiquement, voir lib/data.ts).
export const categories: Category[] = [
  { id: 'cat-espadrilles', slug: 'espadrilles', name_fr: 'Les Espadrilles', name_ar: 'إسبادريل', name_en: 'Espadrilles', image_url: img('photo-1595950653106-6c9ebd614d3a'), is_active: true, sort_order: 1 },
  { id: 'cat-ballerines', slug: 'ballerines', name_fr: 'Les Ballerines', name_ar: 'باليرين', name_en: 'Ballet Flats', image_url: img('photo-1560343090-f0409e92791a'), is_active: true, sort_order: 2 },
  { id: 'cat-talons', slug: 'talons', name_fr: 'Les Talons', name_ar: 'كعب عالي', name_en: 'Heels', image_url: img('photo-1543163521-1bf539c55dd2'), is_active: true, sort_order: 3 },
  { id: 'cat-mocassins', slug: 'mocassins', name_fr: 'Les Mocassins', name_ar: 'موكاسان', name_en: 'Loafers', image_url: img('photo-1518049362265-d5b2a6467637'), is_active: true, sort_order: 4 },
  { id: 'cat-sandales', slug: 'sandales', name_fr: 'Les Sandales', name_ar: 'صنادل', name_en: 'Sandals', image_url: img('photo-1603487742131-4160ec999306'), is_active: true, sort_order: 5 },
];
