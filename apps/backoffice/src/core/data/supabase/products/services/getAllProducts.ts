import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { supabase } from '../../client';
import { Product, ProductType } from '../products.repository';
export default async function getActiveProducts(filters?: {
  active?: boolean;
}): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select()
    .eq('active', filters?.active ?? true);
  if (!data) {
    return [];
  }
  return data.map((product) => ({
    ...sanitizeDatesFromObject(product),
    product_type: (product.product_type || 'single') as ProductType,
  }));
}
