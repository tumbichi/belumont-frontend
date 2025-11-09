import { supabase } from '@core/data/supabase/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { Product } from '../products.repository';
export default async function getProductById(
  id: string
): Promise<(Product & { download_url: string }) | null> {
  const { data } = await supabase.from('products').select().eq('id', id);
  console.log('GET_PRODUCT_BY_ID', data);
  return data && data.length > 0 && data[0]
    ? sanatizeCreatedAtFromObject(data[0])
    : null;
}
