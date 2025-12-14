import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { Order } from '../orders.repository';

export interface OrderWithDetails extends Order {
  users: {
    name: string;
    email: string;
  } | null;
  products: {
    name: string;
  } | null;
  payments: {
    status: string;
  } | null;
}

export default async function getAllOrders(): Promise<OrderWithDetails[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      users (name, email),
      products (name),
      payments (status)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((order) => sanitizeDatesFromObject(order));
}
