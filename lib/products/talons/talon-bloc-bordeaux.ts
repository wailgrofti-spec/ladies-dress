import { buildProduct } from '../_helpers';

export const talonBlocBordeaux = buildProduct(
  {
    id: 'p8', slug: 'talon-bloc-bordeaux', category_id: 'cat-talons',
    name_fr: 'Talon Bloc Bordeaux', name_ar: 'كعب سميك بلون خمري', name_en: 'Bordeaux Block Heel',
    desc_fr: 'Talon carré stable et confortable, dans une teinte bordeaux profonde et raffinée.',
    desc_ar: 'كعب مربع ثابت ومريح، بلون خمري عميق وراقٍ.',
    desc_en: 'Stable, comfortable block heel in a deep, refined bordeaux shade.',
    material: 'Suédine', price: 419, is_bestseller: true,
    colors: [{ name: 'Bordeaux', hex: '#7A2E33' }],
    imageSeeds: ['photo-1596703263926-eb0762ee17e4'],
  },
  7
);
