import { supabase } from '@core/data/supabase/client';
import { PromoCode } from '../promos.repository';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';

export default async function getAllPromoCodes(): Promise<PromoCode[]> {
  const { data, error } = await supabase
    .from('promo_code')
    .select('*, products:promo_code_product(product_id)');

  if (error) {
    throw error;
  }

  return (
    data.map(
      // NOTE: Cannot find a better way to type discount_type to enum value from supabase
      (promoCode) => sanatizeCreatedAtFromObject(promoCode) /* as PromoCode */
    ) || []
  );
}
