import { supabase } from '@core/data/supabase/client';
import sanatizeDatesFromObject from '@core/utils/helpers/sanatizeDatesFromObject';
import { Payment } from '../payments.repository';

export async function createPayment(
  providerId: string,
  provider: 'mercadopago' | 'free' = 'mercadopago',
  promoCodeId?: string
): Promise<Payment> {
  console.debug('Creating payment for order:', {
    providerId,
    provider,
    promoCodeId,
  });
  const { data, error } = await supabase
    .from('payments')
    .insert({
      provider,
      provider_id: providerId,
      promo_code_id: promoCodeId,
    })
    .select();

  if (error) {
    console.error('Error creating payment:', error);
    throw error;
  }

  if (!data || data.length <= 0 || !data[0]) {
    throw new Error('Failed to create payment');
  }

  return sanatizeDatesFromObject(data[0]);
}
