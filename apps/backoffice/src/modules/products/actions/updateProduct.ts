'use server';

import { Product, ProductsRepository, UpdateProduct as UpdateProductType } from '@core/data/supabase/products';
import attempt from '@core/lib/promises/attempt';

export const updateProduct = async (
  productId: string,
  updateData: UpdateProductType
): Promise<Product> => {
  if (Object.keys(updateData).length === 0) {
    throw new Error('No update data provided', {
      cause: 'NO_UPDATE_DATA',
    });
  }

  console.log('[products] updateProduct start', productId, updateData);
  const productsClient = ProductsRepository();

  const { data: productUpdated, error } = await attempt(
    productsClient.update(productId, updateData)
  );

  if (error || !productUpdated) {
    console.error('[updateProduct] Failed to update product', error);
    throw new Error('Failed to update product', {
      cause: error,
    });
  }

  console.log('[products] updateProduct completed', productUpdated);
  return productUpdated;
};
