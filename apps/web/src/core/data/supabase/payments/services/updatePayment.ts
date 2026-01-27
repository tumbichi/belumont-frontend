import { supabase } from '@core/data/supabase/client';
import { Payment } from '../payments.repository';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';

export default async function updatePayment(
  id: string,
  payment: Partial<Pick<Payment, 'status' | 'provider_id' | 'amount'>>
) {
  const { data, error } = await supabase
    .from('payments')
    .update({
      status: payment.status,
      provider_id: payment.provider_id,
      amount: payment.amount,
    })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length <= 0 || !data[0]) {
    throw new Error('Failed to update payment status');
  }

  return sanitizeDatesFromObject(data[0]);
}
