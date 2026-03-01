import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { Product, ProductType } from '../products.repository';

export default async function getProductById(
  id: string
): Promise<Product | null> {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[supabase.products] getProductById error', error);
    throw error;
  }

  if (!product) {
    // No product found for given id
    return null;
  }

  const { data: productImages, error: productImagesError } = await supabase
    .from('product_images')
    .select('resource_url')
    .order('sort_order', { ascending: true })
    .eq('product_id', product.id);

  if (productImagesError) {
    console.error(
      '[supabase.products] getProductById product images error',
      productImagesError
    );
    throw productImagesError;
  }

  return {
    ...sanitizeDatesFromObject(product),
    product_type: (product.product_type || 'single') as ProductType,
    product_images: productImages
      ? productImages.map((image) => image.resource_url)
      : [],
  };
}
