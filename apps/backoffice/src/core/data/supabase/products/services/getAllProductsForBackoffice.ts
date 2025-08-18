import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { supabase } from '../../../client';
import { Product } from '../products.repository';

export default async function getAllProductsForBackoffice(): Promise<
  Product[]
> {
  const { data, error } = await supabase.from('products').select();

  console.log('data', data);
  console.log('error', error);

  if (!data) {
    return [];
  }

  return data.map((product) => sanatizeCreatedAtFromObject(product));
}
