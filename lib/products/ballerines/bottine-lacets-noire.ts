import { buildProduct } from '../_helpers';

export const bottineLacetsNoire = buildProduct(
  {
    id: 'p11', slug: 'bottine-lacets-noire', category_id: 'cat-ballerines',
    name_fr: 'Bottine Lacets Noire', name_ar: 'بوتين أسود برباط', name_en: 'Black Lace-up Ankle Boot',
    desc_fr: 'Bottine robuste à lacets, parfaite pour affronter l\u2019hiver avec style.',
    desc_ar: 'بوتين متين برباط، مثالي لمواجهة الشتاء بأناقة.',
    desc_en: 'Sturdy lace-up ankle boot, perfect for facing winter in style.',
    material: 'Similicuir', price: 459, old_price: 549, is_bestseller: true,
    colors: [{ name: 'Noir', hex: '#1F1B19' }],
    imageSeeds: ['photo-1608256246200-53e635b5b65f'],
  },
  10
);
