import { supabase } from '@core/data/supabase/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanitizeCreatedAtFromObject';
import { ProductWithDownload, ProductType } from '../products.repository';

export default async function getProductById(
  id: string
): Promise<ProductWithDownload | null> {
  const { data } = await supabase
    .from('products')
    .select('id, name, price, pathname, image_url, thumbnail_url, description, product_type, download_url, created_at')
    .eq('id', id);

  if (!data || data.length === 0 || !data[0]) {
    return null;
  }

  const product = data[0];

  return {
    ...sanatizeCreatedAtFromObject(product),
    product_type: (product.product_type || 'single') as ProductType,
    download_url: product.download_url,
  };
}
