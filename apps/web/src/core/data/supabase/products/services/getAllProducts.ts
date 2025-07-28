import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { supabase } from '../../../client';
import { Product } from '../products.repository';

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

  return data.map((product) => sanatizeCreatedAtFromObject(product));
}
