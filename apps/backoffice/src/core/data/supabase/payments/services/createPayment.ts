import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { Payment } from '../payments.repository';

export async function createPayment(
  orderId: string,
  providerId: string,
  provider: 'mercadopago' | 'free' = 'mercadopago'
): Promise<Payment> {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      order_id: orderId,
      provider,
      provider_id: providerId,
    })
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length <= 0 || !data[0]) {
    throw new Error('Failed to create payment');
  }

  return sanitizeDatesFromObject(data[0]);
}
