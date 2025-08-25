import { supabase } from '@core/data/supabase/client';
import { Payment } from '../payments.repository';
import sanatizeDatesFromObject from '@core/utils/helpers/sanatizeDatesFromObject';

export default async function updatePayment(
  id: string,
  payment: Partial<Pick<Payment, 'status' | 'provider_id'>>
) {
  const { data, error } = await supabase
    .from('payments')
    .update({ status: payment.status, provider_id: payment.provider_id })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length <= 0 || !data[0]) {
    throw new Error('Failed to update payment status');
  }

  return sanatizeDatesFromObject(data[0]);
}
