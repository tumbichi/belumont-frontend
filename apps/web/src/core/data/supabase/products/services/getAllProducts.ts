import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanitizeCreatedAtFromObject';
import { supabase } from '../../client';
import { Product, ProductType } from '../products.repository';

export default async function getActiveProducts(filters?: {
  active?: boolean;
}): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('id, name, price, pathname, image_url, thumbnail_url, description, product_type, created_at')
    .eq('active', filters?.active ?? true);

  if (!data) {
    return [];
  }

  return data.map((product) => ({
    ...sanatizeCreatedAtFromObject(product),
    product_type: (product.product_type || 'single') as ProductType,
  }));
}
