import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { Product, ProductType } from '../products.repository';
export default async function getProductByPathname(
  pathname: string
): Promise<Omit<Product, 'download_url'> | null> {
  const { data: product } = await supabase
    .from('products')
    .select(
      'active,created_at,updated_at,description,id,image_url,thumbnail_url,name,pathname,price,product_type'
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
    .order('sort_order', { ascending: true });
  return {
    ...sanitizeDatesFromObject(product),
    product_type: (product.product_type || 'single') as ProductType,
    product_images: productImages
      ? productImages.map((productImage) => productImage.resource_url)
      : [],
  };
}
