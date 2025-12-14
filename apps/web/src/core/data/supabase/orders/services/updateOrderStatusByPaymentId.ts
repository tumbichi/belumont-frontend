import { supabase } from '@core/data/supabase/client';
import { Order, OrderStatus } from '../orders.repository';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';

export default async function updateOrderStatusByPaymentId(
  paymentId: string,
  status: OrderStatus
) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('payment_id', paymentId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return sanitizeDatesFromObject(data);
}
