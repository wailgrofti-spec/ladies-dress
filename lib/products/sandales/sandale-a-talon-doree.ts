import { buildProduct } from '../_helpers';

export const sandaleATalonDoree = buildProduct(
  {
    id: 'p6', slug: 'sandale-a-talon-doree', category_id: 'cat-sandales',
    name_fr: 'Sandale à Talon Dorée', name_ar: 'صندل بكعب ذهبي', name_en: 'Golden Heeled Sandal',
    desc_fr: 'Sandale élégante à petit talon doré, parfaite pour les soirées d\u2019été.',
    desc_ar: 'صندل أنيق بكعب ذهبي صغير، مثالي لسهرات الصيف.',
    desc_en: 'Elegant sandal with a small golden heel, perfect for summer evenings.',
    material: 'Similicuir métallisé', price: 329, is_new: true,
    colors: [{ name: 'Doré', hex: '#D4A574' }],
    imageSeeds: ['photo-1518049362265-d5b2a6467637'],
  },
  5
);
