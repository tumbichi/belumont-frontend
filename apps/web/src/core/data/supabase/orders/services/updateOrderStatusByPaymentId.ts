import { supabase } from '@core/data/supabase/client';
import { Order, OrderStatus } from '../orders.repository';
import sanatizeDatesFromObject from '@core/utils/helpers/sanatizeDatesFromObject';

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

  return sanatizeDatesFromObject(data);
}
