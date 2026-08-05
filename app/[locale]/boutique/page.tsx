import { getTranslations } from 'next-intl/server';
import { getProducts, getCategories } from '@/lib/data';
import ShopGrid from '@/components/ShopGrid';

export default async function BoutiquePage() {
  const t = await getTranslations('shop');
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="container-app py-8">
      <h1 className="font-display text-3xl font-semibold text-charcoal-900">{t('title')}</h1>
      <div className="mt-6">
        <ShopGrid products={products} categories={categories} />
      </div>
    </div>
  );
}
