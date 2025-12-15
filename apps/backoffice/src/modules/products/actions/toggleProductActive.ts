'use server';

import { Product, ProductsRepository } from '@core/data/supabase/products';
import attempt from '@core/lib/promises/attempt';

export const toggleProductActive = async (
  productId: string,
  active: boolean
): Promise<Product> => {
  console.log('[products] toggleProductActive start', productId, active);
  const productsClient = ProductsRepository();

  const { data: productUpdated, error } = await attempt(
    productsClient.update(productId, { active })
  );

  if (error || !productUpdated) {
    console.error('[toggleProductActive] Failed to toggle product active', error);
    throw new Error('Failed to toggle product active', {
      cause: error,
    });
  }

  console.log('[products] toggleProductActive completed', productUpdated);
  return productUpdated;
};
