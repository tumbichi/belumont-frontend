import { supabase } from '@core/data/client';

export default async function incrementPromoCodeUsage(id: string): Promise<void> {
  // First, fetch the current used_count
  const { data: promoData, error: selectError } = await supabase
    .from('promo_code')
    .select('used_count')
    .eq('id', id)
    .single();

  if (selectError) {
    throw new Error(
      `Failed to fetch promo code for incrementing usage: ${selectError.message}`
    );
  }

  if (!promoData) {
    throw new Error('Promo code not found for incrementing usage.');
  }

  // Then, increment the value and update the row
  const { error: updateError } = await supabase
    .from('promo_code')
    .update({ used_count: promoData.used_count ?? 0 + 1 })
    .eq('id', id);

  if (updateError) {
    throw new Error(
      `Failed to increment promo code usage: ${updateError.message}`
    );
  }
}
