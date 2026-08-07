import { buildProduct } from '../_helpers';

// Position d'origine 0 dans le catalogue (sert uniquement à garder une
// date de création cohérente — n'affecte rien d'autre).
export const sneakerBlancheClassic = buildProduct(
  {
    id: 'p1', slug: 'sneaker-blanche-classic', category_id: 'cat-espadrilles',
    name_fr: 'Sneaker Blanche Classic', name_ar: 'سنيكرز أبيض كلاسيك', name_en: 'Classic White Sneaker',
    desc_fr: "Sneaker intemporelle en cuir synthétique, parfaite pour un look casual chic au quotidien.",
    desc_ar: 'حذاء رياضي خالد من الجلد الصناعي، مثالي لإطلالة يومية أنيقة وعصرية.',
    desc_en: 'A timeless sneaker in synthetic leather, perfect for a casual-chic everyday look.',
    material: 'Cuir synthétique', price: 349, old_price: 429, is_bestseller: true,
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Beige', hex: '#E8DCC8' }],
    imageSeeds: ['photo-1595950653106-6c9ebd614d3a', 'photo-1600185365483-26d7a4cc7519'],
  },
  0
);
