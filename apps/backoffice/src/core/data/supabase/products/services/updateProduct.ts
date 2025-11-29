import { supabase } from '@core/data/supabase/client';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanatizeCreatedAtFromObject';
import { Product, UpdateProduct } from '../products.repository';

export default async function updateProduct(
  id: string,
  updates: UpdateProduct
): Promise<Omit<Product, 'created_at'> & { product_images: string[] }> {
  const { product_images, ...productFields } = updates;
  let product: Omit<Product, 'created_at'> | null = null;
  let productImages: { resource_url: string }[] | null = null;

  if (Object.keys(productFields).length > 0) {
    // update main product fields (excluding product_images)
    const { data, error: updateError } = await supabase
      .from('products')
      .update(productFields)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    if (!data) {
      throw new Error('Failed to update product');
    }

    product = data;
  }
  // synchronize product_images if provided (replace existing)
  if (Array.isArray(product_images)) {
    // remove existing image relations
    const { error: delError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', id);

    if (delError) {
      throw delError;
    }

    if (product_images.length > 0) {
      const rows = product_images.map((resource_url) => ({
        product_id: id,
        resource_url,
      }));

      const { error: insertError } = await supabase
        .from('product_images')
        .insert(rows);

      if (insertError) {
        throw insertError;
      }
    }

    // fetch product images to return
    const { data } = await supabase
      .from('product_images')
      .select('resource_url')
      .eq('product_id', id)
      .order('resource_url', { ascending: true });

    productImages = data;
  }

  return {
    ...product,
    product_images: productImages
      ? productImages.map((p) => p.resource_url)
      : [],
  };
}
