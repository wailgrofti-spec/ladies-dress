import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getProducts, getCategories } from '@/lib/data';
import ShopGrid from '@/components/ShopGrid';

export default async function CategoryPage({ params }: { params: { categorie: string } }) {
  const t = await getTranslations('categories');
  const products = await getProducts();
  const categories = await getCategories();

  const category = categories.find((c) => c.slug === params.categorie);
  if (!category) notFound();

  let label = params.categorie;
  try {
    label = t(params.categorie as any);
  } catch {
    // slug inconnu dans les traductions, on garde le slug brut
  }

  return (
    <div className="container-app py-8">
      <h1 className="font-display text-3xl font-semibold text-charcoal-900">{label}</h1>
      <div className="mt-6">
        <ShopGrid products={products} categories={categories} initialCategorySlug={params.categorie} />
      </div>
    </div>
  );
}
