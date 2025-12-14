import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { Order } from '../orders.repository';

export async function createOrder(
  productId: string,
  userId: string,
  paymentId: string
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({ product_id: productId, user_id: userId, payment_id: paymentId })
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length <= 0 || !data[0]) {
    throw new Error('Failed to create order');
  }

  return sanitizeDatesFromObject(data[0]);
}
