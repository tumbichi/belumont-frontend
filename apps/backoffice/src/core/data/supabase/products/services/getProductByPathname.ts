import { supabase } from '@core/data/supabase/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanitizeCreatedAtFromObject';
import { Product } from '../products.repository';
export default async function getProductByPathname(
  pathname: string
): Promise<Omit<Product, 'download_url'> | null> {
  const { data: product } = await supabase
    .from('products')
    .select(
      'active,created_at,description,id,image_url,thumbnail_url,name,pathname,price,id'
    )
    .eq('pathname', pathname)
    .single();
  if (!product) {
    return null;
  }
  const { data: productImages } = await supabase
    .from('product_images')
    .select('resource_url')
    .eq('product_id', product.id)
    .order('resource_url', { ascending: true });
  return {
    ...sanatizeCreatedAtFromObject(product),
    product_images: productImages
      ? productImages.map((productImage) => productImage.resource_url)
      : [],
  };
}
