import { createServerSupabaseClient } from './supabase/server';
import { demoOrders } from './demo-data';
import { Order } from './types';

// Utilisé uniquement côté admin (Server Components sous /admin).
export async function getOrders(): Promise<Order[]> {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return demoOrders as unknown as Order[];

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) return demoOrders as unknown as Order[];
  return data as unknown as Order[];
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.order_number === orderNumber) ?? null;
}
