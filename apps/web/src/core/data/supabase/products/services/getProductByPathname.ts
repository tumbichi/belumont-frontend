import { supabase } from '@core/data/supabase/client';
import { Product, ProductType } from '../products.repository';

export default async function getProductByPathname(
  pathname: string
): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select(
      'created_at,updated_at,description,id,image_url,thumbnail_url,name,pathname,price,product_type'
    )
    .eq('pathname', pathname);

  if (!data || data.length === 0 || !data[0]) {
    return null;
  }

  const product = data[0];

  const { data: productImages } = await supabase
    .from('product_images')
    .select('resource_url')
    .eq('product_id', product.id)
    .order('sort_order', { ascending: true });

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    pathname: product.pathname,
    image_url: product.image_url,
    thumbnail_url: product.thumbnail_url,
    description: product.description,
    product_type: (product.product_type || 'single') as ProductType,
    created_at: new Date(product.created_at),
    updated_at: new Date(product.updated_at),
    product_images: productImages
      ? productImages.map((productImage) => productImage.resource_url)
      : [],
  };
}
