import { supabase } from '@core/data/supabase/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanitizeCreatedAtFromObject';
import { PromoCode } from '../promos.repository';

export default async function getPromoCodeByCode(
  code: string
): Promise<PromoCode | null> {
  const { data } = await supabase
    .from('promo_code')
    .select(
      `
      *,
      products:promo_code_product(product_id)
    `
    )
    .eq('code', code)
    .single();

  if (!data) {
    return null;
  }

  return sanatizeCreatedAtFromObject(data as any) as PromoCode;
}
