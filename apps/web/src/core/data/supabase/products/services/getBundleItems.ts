import { supabase } from '@core/data/supabase/client';
import {
  BundleItem,
  BundleItemPublic,
  ProductType,
} from '../products.repository';

type ProductRow = {
  id: string;
  name: string;
  price: number;
  pathname: string;
  image_url: string;
  thumbnail_url: string;
  description: string | null;
  product_type: string;
  download_url: string | null;
  created_at: string;
  updated_at: string;
};

interface GetBundleItemsOptions {
  includeDownloadUrl?: boolean;
}

/**
 * Get all items (child products) that belong to a bundle
 * Returns products ordered by sort_order
 * @param bundleId - The ID of the bundle
 * @param options.includeDownloadUrl - If true, includes download_url (server-side only). Defaults to false.
 */
export default async function getBundleItems(
  bundleId: string,
  options: { includeDownloadUrl: true }
): Promise<BundleItem[]>;
export default async function getBundleItems(
  bundleId: string,
  options?: { includeDownloadUrl?: false }
): Promise<BundleItemPublic[]>;
export default async function getBundleItems(
  bundleId: string,
  options?: GetBundleItemsOptions
): Promise<BundleItem[] | BundleItemPublic[]> {
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
        created_at,
        updated_at
      )
    `
    )
    .eq('bundle_id', bundleId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching bundle items:', error);
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((item) => {
    // Type assertion needed for nested relation due to Supabase client limitation with FK columns
    const product = item.products as unknown as ProductRow | null;

    if (!product) {
      throw new Error(`Product not found for bundle item ${item.id}`);
    }

    const baseProduct = {
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
    };

    return {
      id: item.id,
      bundle_id: item.bundle_id,
      product_id: item.product_id,
      sort_order: item.sort_order,
      product: options?.includeDownloadUrl
        ? { ...baseProduct, download_url: product.download_url }
        : baseProduct,
    };
  });
}
