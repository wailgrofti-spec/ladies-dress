import { notFound } from 'next/navigation';
import { getOrders } from '@/lib/orders-data';
import OrderDetail from '@/components/admin/OrderDetail';

export default async function AdminOrderPage({ params }: { params: { id: string } }) {
  const orders = await getOrders();
  const order = orders.find((o) => o.id === params.id);
  if (!order) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">Commande {order.order_number}</h1>
      <div className="mt-6">
        <OrderDetail order={order} />
      </div>
    </div>
  );
}
