import { supabase } from '@core/data/client';
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

  return data as PromoCode | null;
}
