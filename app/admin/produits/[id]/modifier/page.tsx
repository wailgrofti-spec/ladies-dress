import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/data';
import ProductForm from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const categories = await getCategories();
  const products = await getProducts();
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Modifier : {product.name_fr}</h1>
      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} existing={product} />
      </div>
    </div>
  );
}
