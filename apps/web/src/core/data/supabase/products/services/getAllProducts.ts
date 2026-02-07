import { supabase } from '../../client';
import { Product, ProductType } from '../products.repository';

export default async function getActiveProducts(filters?: {
  active?: boolean;
}): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('id, name, price, pathname, image_url, thumbnail_url, description, product_type, created_at, updated_at')
    .eq('active', filters?.active ?? true)
    .order('updated_at', { ascending: false });

  if (!data) {
    return [];
  }

  return data.map((product) => ({
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
  }));
}
