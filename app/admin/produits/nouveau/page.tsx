import { getCategories } from '@/lib/data';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Ajouter un produit</h1>
      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
