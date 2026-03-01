import { supabase } from '@core/data/supabase/client';

/**
 * Remove a single item from a bundle and re-normalize sort_order
 * so remaining items have consecutive values (0, 1, 2, ...)
 */
export default async function removeBundleItem(
  bundleItemId: string
): Promise<void> {
  // Get the bundle_id before deleting so we can re-normalize
  const { data: itemToDelete } = await supabase
    .from('product_bundle_items')
    .select('bundle_id')
    .eq('id', bundleItemId)
    .single();

  const { error } = await supabase
    .from('product_bundle_items')
    .delete()
    .eq('id', bundleItemId);

  if (error) {
    console.error('Error removing bundle item:', error);
    throw error;
  }

  // Re-normalize sort_order for remaining items
  if (itemToDelete?.bundle_id) {
    const { data: remaining } = await supabase
      .from('product_bundle_items')
      .select('id')
      .eq('bundle_id', itemToDelete.bundle_id)
      .order('sort_order', { ascending: true });

    if (remaining && remaining.length > 0) {
      await Promise.all(
        remaining.map((item, index) =>
          supabase
            .from('product_bundle_items')
            .update({ sort_order: index })
            .eq('id', item.id)
        )
      );
    }
  }
}
