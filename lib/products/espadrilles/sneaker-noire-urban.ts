import { buildProduct } from '../_helpers';

export const sneakerNoireUrban = buildProduct(
  {
    id: 'p3', slug: 'sneaker-noire-urban', category_id: 'cat-espadrilles',
    name_fr: 'Sneaker Noire Urban', name_ar: 'سنيكرز أسود أوربان', name_en: 'Urban Black Sneaker',
    desc_fr: 'Silhouette épurée et semelle épaisse pour un style urbain affirmé.',
    desc_ar: 'تصميم أنيق ونعل سميك لإطلالة حضرية جريئة.',
    desc_en: 'Clean silhouette and chunky sole for a bold urban style.',
    material: 'Cuir synthétique', price: 399,
    colors: [{ name: 'Noir', hex: '#1F1B19' }, { name: 'Gris', hex: '#B7B2AC' }],
    imageSeeds: ['photo-1595341888016-a392ef81b7de'],
  },
  2
);
