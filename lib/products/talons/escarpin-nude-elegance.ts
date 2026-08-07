import { buildProduct } from '../_helpers';

export const escarpinNudeElegance = buildProduct(
  {
    id: 'p7', slug: 'escarpin-nude-elegance', category_id: 'cat-talons',
    name_fr: 'Escarpin Nude Élégance', name_ar: 'كعب نود أنيق', name_en: 'Nude Elegance Pump',
    desc_fr: 'Escarpin pointu à talon fin, un incontournable chic pour toutes les occasions.',
    desc_ar: 'كعب مدبب رفيع، قطعة أساسية أنيقة لجميع المناسبات.',
    desc_en: 'Pointed pump with a slim heel, a chic essential for every occasion.',
    material: 'Similicuir satiné', price: 449, old_price: 549,
    colors: [{ name: 'Nude', hex: '#DDBBA5' }, { name: 'Noir', hex: '#1F1B19' }],
    imageSeeds: ['photo-1543163521-1bf539c55dd2'],
  },
  6
);
