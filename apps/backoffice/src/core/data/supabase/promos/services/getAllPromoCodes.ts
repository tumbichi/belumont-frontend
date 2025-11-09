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
    data.map((promoCode) => {
      // Explicitly cast discount_type to the expected literal type
      const sanitizedPromoCode = {
        ...promoCode,
        discount_type: promoCode.discount_type as 'PERCENTAGE' | 'FIXED',
      };
      return sanatizeCreatedAtFromObject(sanitizedPromoCode) as PromoCode;
    }) || []
  );
}
