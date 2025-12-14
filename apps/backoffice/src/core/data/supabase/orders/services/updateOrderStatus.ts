import { supabase } from '@core/data/supabase/client';
import { OrderStatus } from '../orders.repository';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';

export default async function updateOrderStatus(
  id: string,
  status: OrderStatus
) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length <= 0 || !data[0]) {
    throw new Error('Failed to create order');
  }

  return sanitizeDatesFromObject(data[0]);
}
