import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { OrderDetailExpanded } from '@modules/orders/types';

export default async function getOrderByIdExpanded(
  id: string
): Promise<OrderDetailExpanded | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      created_at,
      updated_at,
      status,
      payment_id,
      users (name, email),
      products (name, price, product_type),
      payments (
        id,
        amount,
        provider,
        provider_id,
        status,
        promo_codes:promo_code (code, discount_type, discount_value)
      )
    `
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return sanitizeDatesFromObject(data) as unknown as OrderDetailExpanded;
}
