import { buildProduct } from '../_helpers';

export const sandalePlateTressee = buildProduct(
  {
    id: 'p5', slug: 'sandale-plate-tresse', category_id: 'cat-sandales',
    name_fr: 'Sandale Plate Tressée', name_ar: 'صندل مسطح مجدول', name_en: 'Braided Flat Sandal',
    desc_fr: 'Sandale plate à la lanière tressée, idéale pour les journées chaudes.',
    desc_ar: 'صندل مسطح بحزام مجدول، مثالي للأيام الحارة.',
    desc_en: 'Flat sandal with a braided strap, ideal for hot days.',
    material: 'Cuir véritable', price: 289, old_price: 349, is_bestseller: true,
    colors: [{ name: 'Camel', hex: '#C08552' }, { name: 'Blanc', hex: '#FFFFFF' }],
    imageSeeds: ['photo-1603487742131-4160ec999306'],
  },
  4
);
