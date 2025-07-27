import { supabase } from '@core/data/client';
import sanatizeDatesFromObject from '@core/utils/helpers/sanatizeDatesFromObject';
import { Order } from '../orders.repository';

export async function createOrder(
  productId: string,
  userId: string
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({ product_id: productId, user_id: userId })
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length <= 0 || !data[0]) {
    throw new Error('Failed to create order');
  }

  return sanatizeDatesFromObject(data[0]);
}
