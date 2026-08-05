import { Category, Product, Review } from './types';

// Images placeholder libres de droit (Unsplash) — à remplacer depuis /admin
// par les vraies photos produits une fois disponibles.
const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=800&q=80`;

export const demoCategories: Category[] = [
  { id: 'cat-espadrilles', slug: 'espadrilles', name_fr: 'Les Espadrilles', name_ar: 'إسبادريل', name_en: 'Espadrilles', image_url: img('photo-1595950653106-6c9ebd614d3a'), is_active: true, sort_order: 1 },
  { id: 'cat-ballerines', slug: 'ballerines', name_fr: 'Les Ballerines', name_ar: 'باليرين', name_en: 'Ballet Flats', image_url: img('photo-1560343090-f0409e92791a'), is_active: true, sort_order: 2 },
  { id: 'cat-talons', slug: 'talons', name_fr: 'Les Talons', name_ar: 'كعب عالي', name_en: 'Heels', image_url: img('photo-1543163521-1bf539c55dd2'), is_active: true, sort_order: 3 },
  { id: 'cat-mocassins', slug: 'mocassins', name_fr: 'Les Mocassins', name_ar: 'موكاسان', name_en: 'Loafers', image_url: img('photo-1600798310215-8dda2ec1cae0'), is_active: true, sort_order: 4 },
  { id: 'cat-sandales', slug: 'sandales', name_fr: 'Les Sandales', name_ar: 'صنادل', name_en: 'Sandals', image_url: img('photo-1603487742131-4160ec999306'), is_active: true, sort_order: 5 },
];

const sizes = ['36', '37', '38', '39', '40', '41'];

function makeVariants(productId: string, colors: { name: string; hex: string }[]): Product['variants'] {
  const variants: Product['variants'] = [];
  colors.forEach((c, ci) => {
    sizes.forEach((s, si) => {
      variants.push({
        id: `${productId}-v-${ci}-${si}`,
        product_id: productId,
        color_name: c.name,
        color_hex: c.hex,
        size: s,
        sku: `${productId.toUpperCase()}-${c.name.slice(0, 3).toUpperCase()}-${s}`,
        stock_quantity: (ci + si) % 4, // varie le stock, certaines tailles à 0
        is_active: true,
      });
    });
  });
  return variants;
}

function makeImages(productId: string, seeds: string[]): Product['images'] {
  return seeds.map((seed, i) => ({
    id: `${productId}-img-${i}`,
    product_id: productId,
    url: img(seed),
    alt_text_fr: 'Photo produit',
    alt_text_ar: 'صورة المنتج',
    alt_text_en: 'Product photo',
    sort_order: i,
    is_primary: i === 0,
  }));
}

interface SeedProduct {
  id: string;
  slug: string;
  category_id: string;
  name_fr: string; name_ar: string; name_en: string;
  desc_fr: string; desc_ar: string; desc_en: string;
  material: string;
  price: number;
  old_price?: number;
  is_new?: boolean;
  is_bestseller?: boolean;
  colors: { name: string; hex: string }[];
  imageSeeds: string[];
}

const seeds: SeedProduct[] = [
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
  {
    id: 'p6', slug: 'sandale-a-talon-doree', category_id: 'cat-sandales',
    name_fr: 'Sandale à Talon Dorée', name_ar: 'صندل بكعب ذهبي', name_en: 'Golden Heeled Sandal',
    desc_fr: 'Sandale élégante à petit talon doré, parfaite pour les soirées d\u2019été.',
    desc_ar: 'صندل أنيق بكعب ذهبي صغير، مثالي لسهرات الصيف.',
    desc_en: 'Elegant sandal with a small golden heel, perfect for summer evenings.',
    material: 'Similicuir métallisé', price: 329, is_new: true,
    colors: [{ name: 'Doré', hex: '#D4A574' }],
    imageSeeds: ['photo-1518049362265-d5b2a6467637'],
  },
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
  {
    id: 'p10', slug: 'mocassin-cuir-camel', category_id: 'cat-mocassins',
    name_fr: 'Mocassin Cuir Camel', name_ar: 'موكاسان جلد بلون الجمل', name_en: 'Camel Leather Loafer',
    desc_fr: 'Mocassin classique en cuir camel, chic et polyvalent pour le bureau comme la ville.',
    desc_ar: 'موكاسان كلاسيكي من الجلد بلون الجمل، أنيق ومتعدد الاستخدامات للعمل والخروج.',
    desc_en: 'Classic camel leather loafer, chic and versatile for the office or the city.',
    material: 'Cuir véritable', price: 389, is_new: true,
    colors: [{ name: 'Camel', hex: '#C08552' }],
    imageSeeds: ['photo-1600798310215-8dda2ec1cae0'],
  },
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
  {
    id: 'p12', slug: 'bottine-daim-chataigne', category_id: 'cat-mocassins',
    name_fr: 'Bottine Daim Châtaigne', name_ar: 'بوتين شمواه كستنائي', name_en: 'Chestnut Suede Ankle Boot',
    desc_fr: 'Bottine en suédine douce, teinte châtaigne chaleureuse pour la saison automne-hiver.',
    desc_ar: 'بوتين من الشمواه الناعم، بلون كستنائي دافئ لموسم الخريف والشتاء.',
    desc_en: 'Soft suede ankle boot in a warm chestnut shade for autumn-winter.',
    material: 'Suédine', price: 429,
    colors: [{ name: 'Châtaigne', hex: '#8B5E3C' }],
    imageSeeds: ['photo-1608256246486-2b0f6a4a5b7d'],
  },
];

export const demoProducts: Product[] = seeds.map((s, i) => ({
  id: s.id,
  category_id: s.category_id,
  slug: s.slug,
  name_fr: s.name_fr,
  name_ar: s.name_ar,
  name_en: s.name_en,
  description_fr: s.desc_fr,
  description_ar: s.desc_ar,
  description_en: s.desc_en,
  material: s.material,
  brand: 'Ladies Dress',
  weight_grams: 350 + i * 10,
  sku: `LD-${s.id.toUpperCase()}`,
  price: s.price,
  old_price: s.old_price ?? null,
  is_new: !!s.is_new,
  is_bestseller: !!s.is_bestseller,
  is_active: true,
  status: 'active',
  meta_title: `${s.name_fr} — Ladies Dress`,
  meta_description: s.desc_fr.slice(0, 150),
  created_at: new Date(Date.now() - (seeds.length - i) * 86400_000).toISOString(),
  images: makeImages(s.id, s.imageSeeds),
  variants: makeVariants(s.id, s.colors),
}));

export const demoReviews: Review[] = [
  { id: 'r1', product_id: null, customer_name: 'Salma, Casablanca', rating: 5, comment: 'Livraison rapide et chaussures magnifiques, exactement comme sur les photos !', is_approved: true, created_at: new Date().toISOString() },
  { id: 'r2', product_id: null, customer_name: 'Imane, Rabat', rating: 5, comment: 'Très bonne qualité, je recommande vivement cette boutique.', is_approved: true, created_at: new Date().toISOString() },
  { id: 'r3', product_id: null, customer_name: 'Fatima Zahra, Marrakech', rating: 4, comment: 'Jolies sneakers, confortables. Le service client sur WhatsApp est très réactif.', is_approved: true, created_at: new Date().toISOString() },
  { id: 'r4', product_id: 'p1', customer_name: 'Nawal', rating: 5, comment: 'Exactement ma pointure habituelle, très confortable dès le premier jour.', is_approved: true, created_at: new Date(Date.now() - 5 * 86400_000).toISOString() },
  { id: 'r5', product_id: 'p1', customer_name: 'Khadija', rating: 4, comment: 'Jolie sneaker, un peu large donc je conseille de prendre une demi-pointure en moins.', is_approved: true, created_at: new Date(Date.now() - 10 * 86400_000).toISOString() },
  { id: 'r6', product_id: 'p7', customer_name: 'Meryem', rating: 5, comment: "Parfait pour un mariage, très élégant et pas du tout douloureux malgré le talon.", is_approved: true, created_at: new Date(Date.now() - 3 * 86400_000).toISOString() },
  { id: 'r7', product_id: 'p11', customer_name: 'Asmaa', rating: 3, comment: 'Jolie bottine mais le cuir a mis du temps à s\u2019assouplir.', is_approved: true, created_at: new Date(Date.now() - 20 * 86400_000).toISOString() },
];

export const demoOrders = [
  {
    id: 'o1', order_number: 'LD-260801-4821', customer_name: 'Salma Bennani', phone: '0661234567', whatsapp: '0661234567',
    city: 'Casablanca', address: '12 Rue des Fleurs', neighborhood: 'Maarif', landmark: '', payment_method: 'cod' as const,
    subtotal: 349, shipping_fee: 25, discount: 0, total: 374, comment: '', status: 'nouvelle' as const,
    items: [{ product_id: 'p1', variant_id: 'p1-v-0-1', product_name: 'Sneaker Blanche Classic', color: 'Blanc', size: '37', price: 349, quantity: 1 }],
    created_at: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: 'o2', order_number: 'LD-260801-2290', customer_name: 'Imane Chraibi', phone: '0662345678', whatsapp: '0662345678',
    city: 'Rabat', address: '5 Avenue Hassan II', neighborhood: 'Agdal', landmark: 'Près de la pharmacie', payment_method: 'cod' as const,
    subtotal: 289, shipping_fee: 25, discount: 0, total: 314, comment: '', status: 'confirmee' as const,
    items: [{ product_id: 'p5', variant_id: 'p5-v-0-2', product_name: 'Sandale Plate Tressée', color: 'Camel', size: '38', price: 289, quantity: 1 }],
    created_at: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: 'o3', order_number: 'LD-260731-1187', customer_name: 'Fatima Zahra Idrissi', phone: '0663456789', whatsapp: '0663456789',
    city: 'Kénitra', address: '20 Rue Allal Ben Abdellah', neighborhood: 'Centre-ville', landmark: '', payment_method: 'bank_transfer' as const,
    subtotal: 748, shipping_fee: 0, discount: 50, total: 698, comment: 'Livrer après 17h svp', status: 'expediee' as const,
    items: [
      { product_id: 'p7', variant_id: 'p7-v-0-3', product_name: 'Escarpin Nude Élégance', color: 'Nude', size: '39', price: 449, quantity: 1 },
      { product_id: 'p9', variant_id: 'p9-v-0-1', product_name: 'Ballerine Nœud Beige', color: 'Beige', size: '37', price: 259, quantity: 1 },
    ],
    created_at: new Date(Date.now() - 172800_000).toISOString(),
  },
  {
    id: 'o4', order_number: 'LD-260729-9034', customer_name: 'Sara El Amrani', phone: '0664567890', whatsapp: '0664567890',
    city: 'Marrakech', address: '8 Derb El Ferrane', neighborhood: 'Guéliz', landmark: '', payment_method: 'cod' as const,
    subtotal: 459, shipping_fee: 35, discount: 0, total: 494, comment: '', status: 'livree' as const,
    items: [{ product_id: 'p11', variant_id: 'p11-v-0-2', product_name: 'Bottine Lacets Noire', color: 'Noir', size: '38', price: 459, quantity: 1 }],
    created_at: new Date(Date.now() - 5 * 86400_000).toISOString(),
  },
];

export const demoShippingZones = [
  { id: 'z1', city_name: 'Casablanca', price: 25, is_active: true, free_shipping_threshold: 500 },
  { id: 'z2', city_name: 'Rabat', price: 25, is_active: true, free_shipping_threshold: 500 },
  { id: 'z3', city_name: 'Kénitra', price: 25, is_active: true, free_shipping_threshold: 500 },
  { id: 'z4', city_name: 'Marrakech', price: 35, is_active: true, free_shipping_threshold: 500 },
  { id: 'z5', city_name: 'Fès', price: 35, is_active: true, free_shipping_threshold: 500 },
  { id: 'z6', city_name: 'Tanger', price: 35, is_active: true, free_shipping_threshold: 500 },
  { id: 'z7', city_name: 'Agadir', price: 40, is_active: true, free_shipping_threshold: 500 },
  { id: 'z8', city_name: 'Oujda', price: 45, is_active: true, free_shipping_threshold: 500 },
  { id: 'z9', city_name: 'Autre ville', price: 45, is_active: true, free_shipping_threshold: 500 },
];
