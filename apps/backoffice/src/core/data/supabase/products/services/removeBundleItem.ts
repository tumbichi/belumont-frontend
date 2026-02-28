import { supabase } from '@core/data/supabase/client';

/**
 * Remove a single item from a bundle
 */
export default async function removeBundleItem(
  bundleItemId: string
): Promise<void> {
  const { error } = await supabase
    .from('product_bundle_items')
    .delete()
    .eq('id', bundleItemId);

  if (error) {
    console.error('Error removing bundle item:', error);
    throw error;
  }
}
