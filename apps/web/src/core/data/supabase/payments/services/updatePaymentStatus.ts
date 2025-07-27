import { supabase } from '@core/data/client';
import { PaymentStatus } from '../payments.repository';
import sanatizeDatesFromObject from '@core/utils/helpers/sanatizeDatesFromObject';

export default async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
) {
  const { data, error } = await supabase
    .from('payments')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) {
    throw error;
  }

  if (!data || data.length <= 0) {
    throw new Error('Failed to update payment status');
  }

  return sanatizeDatesFromObject(data[0]);
}
