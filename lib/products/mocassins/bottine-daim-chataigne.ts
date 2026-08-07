import { buildProduct } from '../_helpers';

export const bottineDaimChataigne = buildProduct(
  {
    id: 'p12', slug: 'bottine-daim-chataigne', category_id: 'cat-mocassins',
    name_fr: 'Bottine Daim Châtaigne', name_ar: 'بوتين شمواه كستنائي', name_en: 'Chestnut Suede Ankle Boot',
    desc_fr: 'Bottine en suédine douce, teinte châtaigne chaleureuse pour la saison automne-hiver.',
    desc_ar: 'بوتين من الشمواه الناعم، بلون كستنائي دافئ لموسم الخريف والشتاء.',
    desc_en: 'Soft suede ankle boot in a warm chestnut shade for autumn-winter.',
    material: 'Suédine', price: 429,
    colors: [{ name: 'Châtaigne', hex: '#8B5E3C' }],
    imageSeeds: ['photo-1608256246486-2b0f6a4a5b7d'],
  },
  11
);
