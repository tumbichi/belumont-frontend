import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { Product } from '../products.repository';

export type CreateProductInput = Pick<
  Product,
  'name' | 'price' | 'pathname' | 'description'
> &
  Partial<
    Pick<
      Product,
      'id' | 'image_url' | 'download_url' | 'thumbnail_url' | 'product_images'
    >
  >;

export default async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const { product_images, ...productData } = input;

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      // Provide defaults if not provided, but allow them to be passed
      image_url: productData.image_url ?? '',
      download_url: productData.download_url ?? '',
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create product');
  }

  if (product_images && product_images.length > 0) {
    const imageRows = product_images.map((url) => ({
      product_id: data.id,
      resource_url: url,
    }));

    const { error: imgError } = await supabase
      .from('product_images')
      .insert(imageRows);

    if (imgError) {
      // Rollback product creation
      await supabase.from('products').delete().eq('id', data.id);
      throw imgError;
    }
  }

  return {
    ...sanitizeDatesFromObject(data),
    product_images: product_images || [],
  } as Product;
}
