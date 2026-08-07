import { buildProduct } from '../_helpers';

export const mocassinCuirCamel = buildProduct(
  {
    id: 'p10', slug: 'mocassin-cuir-camel', category_id: 'cat-mocassins',
    name_fr: 'Mocassin Cuir Camel', name_ar: 'موكاسان جلد بلون الجمل', name_en: 'Camel Leather Loafer',
    desc_fr: 'Mocassin classique en cuir camel, chic et polyvalent pour le bureau comme la ville.',
    desc_ar: 'موكاسان كلاسيكي من الجلد بلون الجمل، أنيق ومتعدد الاستخدامات للعمل والخروج.',
    desc_en: 'Classic camel leather loafer, chic and versatile for the office or the city.',
    material: 'Cuir véritable', price: 389, is_new: true,
    colors: [{ name: 'Camel', hex: '#C08552' }],
    imageSeeds: ['photo-1600185365483-26d7a4cc7519'],
  },
  9
);
