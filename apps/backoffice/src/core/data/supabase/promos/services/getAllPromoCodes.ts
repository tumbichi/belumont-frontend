import { supabase } from '@core/data/client';
import { PromoCode } from '../promos.repository';

export default async function getAllPromoCodes(): Promise<PromoCode[]> {
  const { data, error } = await supabase
    .from('promo_code')
    .select('*, products:promo_code_product(product_id)');

  if (error) {
    throw error;
  }

  return data || [];
}
