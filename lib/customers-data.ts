import { getOrders } from './orders-data';

export interface Customer {
  phone: string;
  name: string;
  whatsapp: string;
  city: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  firstOrderDate: string;
  status: 'nouveau' | 'fidele' | 'vip';
}

const VALID_STATUSES = ['confirmee', 'en_preparation', 'expediee', 'livree'];

export async function getCustomers(): Promise<Customer[]> {
  const orders = await getOrders();
  const byPhone = new Map<string, typeof orders>();

  orders.forEach((o) => {
    const list = byPhone.get(o.phone) ?? [];
    list.push(o);
    byPhone.set(o.phone, list);
  });

  const customers: Customer[] = Array.from(byPhone.entries()).map(([phone, custOrders]) => {
    const sorted = [...custOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const totalSpent = custOrders
      .filter((o) => VALID_STATUSES.includes(o.status))
      .reduce((s, o) => s + o.total, 0);

    let status: Customer['status'] = 'nouveau';
    if (custOrders.length >= 5 || totalSpent >= 2000) status = 'vip';
    else if (custOrders.length >= 2) status = 'fidele';

    return {
      phone,
      name: sorted[0].customer_name,
      whatsapp: sorted[0].whatsapp || phone,
      city: sorted[0].city,
      address: sorted[0].address,
      orderCount: custOrders.length,
      totalSpent,
      lastOrderDate: sorted[0].created_at,
      firstOrderDate: sorted[sorted.length - 1].created_at,
      status,
    };
  });

  return customers.sort((a, b) => b.totalSpent - a.totalSpent);
}
