import { getOrders } from '@/lib/orders-data';
import OrdersTable from '@/components/admin/OrdersTable';

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900 dark:text-white">Commandes</h1>
      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
