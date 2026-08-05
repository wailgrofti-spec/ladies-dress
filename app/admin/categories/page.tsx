import { getCategories } from '@/lib/data';
import CategoriesManager from '@/components/admin/CategoriesManager';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Catégories</h1>
      <p className="mt-1 text-sm text-charcoal-700">
        Gérez les catégories de chaussures. L'architecture permet d'ajouter facilement vêtements,
        sacs et accessoires plus tard.
      </p>
      <div className="mt-6">
        <CategoriesManager categories={categories} />
      </div>
    </div>
  );
}
