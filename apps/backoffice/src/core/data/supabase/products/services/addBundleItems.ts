import { supabase } from '@core/data/supabase/client';

/**
 * Add products to a bundle by creating bundle item entries
 */
export default async function addBundleItems(
  bundleId: string,
  productIds: string[]
): Promise<void> {
  // Get current max sort_order for this bundle
  const { data: existing } = await supabase
    .from('product_bundle_items')
    .select('sort_order')
    .eq('bundle_id', bundleId)
    .order('sort_order', { ascending: false })
    .limit(1);

  let nextSortOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const rows = productIds.map((productId) => ({
    bundle_id: bundleId,
    product_id: productId,
    sort_order: nextSortOrder++,
  }));

  const { error } = await supabase
    .from('product_bundle_items')
    .insert(rows);

  if (error) {
    console.error('Error adding bundle items:', error);
    throw error;
  }
}
