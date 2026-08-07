import { buildProduct } from '../_helpers';

export const sneakerBeigeConfort = buildProduct(
  {
    id: 'p4', slug: 'sneaker-beige-confort', category_id: 'cat-espadrilles',
    name_fr: 'Sneaker Beige Confort', name_ar: 'سنيكرز بيج مريح', name_en: 'Comfort Beige Sneaker',
    desc_fr: 'Semelle mémoire de forme pour un confort optimal, à porter du matin au soir.',
    desc_ar: 'نعل بذاكرة الشكل لراحة قصوى، يمكن ارتداؤه من الصباح إلى المساء.',
    desc_en: 'Memory foam sole for optimal comfort, wearable from morning to evening.',
    material: 'Textile respirant', price: 359,
    colors: [{ name: 'Beige', hex: '#E8DCC8' }],
    imageSeeds: ['photo-1465453869711-7e174808ace9'],
  },
  3
);
