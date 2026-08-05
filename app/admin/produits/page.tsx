import { getProducts, getCategories } from '@/lib/data';
import ProductsTable from '@/components/admin/ProductsTable';

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Produits</h1>
      <div className="mt-6">
        <ProductsTable products={products} categories={categories} />
      </div>
    </div>
  );
}
