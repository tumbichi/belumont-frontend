import { supabase } from '@core/data/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { Product } from '../products.repository';

export default async function getProductByPathname(
  pathname: string
): Promise<Omit<Product, 'download_url'> | null> {
  const { data } = await supabase
    .from('products')
    .select('created_at,description,id,image_url,thumbnail_url,name,pathname,price,id')
    .eq('pathname', pathname);

  if (!data || data.length === 0 || !data[0]) {
    return null;
  }

  const { data: productImages } = await supabase
    .from('product_images')
    .select('resource_url')
    .eq('product_id', data[0].id)
    .order('resource_url', { ascending: true });

  return {
    ...sanatizeCreatedAtFromObject(data[0]),
    product_images: productImages
      ? productImages.map((productImage) => productImage.resource_url)
      : [],
  };
}
