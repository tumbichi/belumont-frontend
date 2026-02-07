import { supabase } from '@core/data/supabase/client';
import { BundleItem, ProductType } from '../products.repository';

type ProductRow = {
  id: string;
  name: string;
  price: number;
  pathname: string;
  image_url: string;
  thumbnail_url: string;
  description: string | null;
  product_type: string;
  download_url: string;
  active: boolean;
  created_at: string;
};

/**
 * Get all items (child products) that belong to a bundle
 * Returns products ordered by sort_order
 */
export default async function getBundleItems(
  bundleId: string
): Promise<BundleItem[]> {
  const { data, error } = await supabase
    .from('product_bundle_items')
    .select(
      `
      id,
      bundle_id,
      product_id,
      sort_order,
      products:product_id (
        id,
        name,
        price,
        pathname,
        image_url,
        thumbnail_url,
        description,
        product_type,
        download_url,
        active,
        created_at
      )
    `
    )
    .eq('bundle_id', bundleId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching bundle items:', error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => {
    const product = item.products as unknown as ProductRow | null;

    if (!product) {
      throw new Error(`Product not found for bundle item ${item.id}`);
    }

    return {
      id: item.id,
      bundle_id: item.bundle_id,
      product_id: item.product_id,
      sort_order: item.sort_order,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        pathname: product.pathname,
        image_url: product.image_url,
        thumbnail_url: product.thumbnail_url,
        description: product.description,
        product_type: (product.product_type || 'single') as ProductType,
        download_url: product.download_url,
        active: product.active,
        created_at: new Date(product.created_at),
      },
    };
  });
}
