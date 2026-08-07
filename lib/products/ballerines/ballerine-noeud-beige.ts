import { buildProduct } from '../_helpers';

export const ballerineNoeudBeige = buildProduct(
  {
    id: 'p9', slug: 'ballerine-noeud-beige', category_id: 'cat-ballerines',
    name_fr: 'Ballerine Nœud Beige', name_ar: 'باليرين بعقدة بيج', name_en: 'Beige Bow Ballet Flat',
    desc_fr: 'Ballerine douce ornée d\u2019un nœud, pour un look féminin et confortable.',
    desc_ar: 'باليرين ناعم مزين بعقدة، لإطلالة أنثوية ومريحة.',
    desc_en: 'Soft ballet flat adorned with a bow, for a feminine and comfortable look.',
    material: 'Cuir synthétique souple', price: 259,
    colors: [{ name: 'Beige', hex: '#E8DCC8' }, { name: 'Rose', hex: '#E8C4C4' }],
    imageSeeds: ['photo-1560343090-f0409e92791a'],
  },
  8
);
