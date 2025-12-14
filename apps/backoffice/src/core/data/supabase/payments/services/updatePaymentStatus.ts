import { supabase } from '@core/data/supabase/client';
import { PaymentStatus } from '../payments.repository';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';

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

  if (!data || data.length <= 0 || !data[0]) {
    throw new Error('Failed to update payment status');
  }

  return sanitizeDatesFromObject(data[0]);
}
