import { buildProduct } from '../_helpers';

export const sneakerRosePoudre = buildProduct(
  {
    id: 'p2', slug: 'sneaker-rose-poudre', category_id: 'cat-espadrilles',
    name_fr: 'Sneaker Rose Poudré', name_ar: 'سنيكرز وردي فاتح', name_en: 'Powder Pink Sneaker',
    desc_fr: 'Une touche de douceur avec cette sneaker rose poudré, légère et confortable toute la journée.',
    desc_ar: 'لمسة من الرقة مع هذا السنيكرز الوردي الفاتح، خفيف ومريح طوال اليوم.',
    desc_en: 'A touch of softness with this powder pink sneaker, light and comfortable all day.',
    material: 'Toile & cuir synthétique', price: 379, is_new: true,
    colors: [{ name: 'Rose poudré', hex: '#E8C4C4' }],
    imageSeeds: ['photo-1600269452121-4f2416e55c28'],
  },
  1
);
