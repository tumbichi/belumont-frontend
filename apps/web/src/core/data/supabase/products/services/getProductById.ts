import { supabase } from '@core/data/supabase/client';
import { ProductWithDownload, ProductType } from '../products.repository';

export default async function getProductById(
  id: string
): Promise<ProductWithDownload | null> {
  const { data } = await supabase
    .from('products')
    .select('id, name, price, pathname, image_url, thumbnail_url, description, product_type, download_url, created_at, updated_at')
    .eq('id', id);

  if (!data || data.length === 0 || !data[0]) {
    return null;
  }

  const product = data[0];

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    pathname: product.pathname,
    image_url: product.image_url,
    thumbnail_url: product.thumbnail_url,
    description: product.description,
    product_type: (product.product_type || 'single') as ProductType,
    download_url: product.download_url,
    created_at: new Date(product.created_at),
    updated_at: new Date(product.updated_at),
  };
}
