import { supabase } from '@core/data/client';

export default async function incrementPromoCodeUsage(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_promo_code_usage', {
    promo_code_id: id,
  });

  if (error) {
    throw new Error(
      `Failed to increment promo code usage: ${error.message}`
    );
  }
}
