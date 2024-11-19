import { supabase } from '@core/data/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { Product } from '../products.repository';

export default async function getProductByPathname(
  pathname: string
): Promise<Omit<Product, 'download_url'> | null> {
  const { data } = await supabase
    .from('products')
    .select('created_at,description,id,image_url,name,pathname,price,id')
    .eq('pathname', pathname);

  return data && data.length > 0 ? sanatizeCreatedAtFromObject(data[0]) : null;
}
