import { supabase } from '@core/data/supabase/client';
import sanitizeCreatedAtFromObject from '@core/utils/helpers/sanitizeCreatedAtFromObject';
import { Product, ProductType, UpdateProduct } from '../products.repository';
import { Database } from '../../types/supabase';

type ProductSupabase = Database['public']['Tables']['products']['Row'];

export default async function updateProduct(
  id: string,
  updates: UpdateProduct
): Promise<Product & { product_images: string[] }> {
  const { product_images, ...productFields } = updates;
  let product: ProductSupabase | null = null;
  let productImages: { resource_url: string }[] | null = null;

  if (Object.keys(productFields).length > 0) {
    console.log('[updateProduct] updating product fields', productFields);
    // update main product fields (excluding product_images)
    const { data, error: updateError } = await supabase
      .from('products')
      .update(productFields)
      .eq('id', id)
      .select('*')
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
    console.log('[updateProduct] updating product images', product_images);
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

      console.log('[updateProduct] inserting new product images', rows);

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
    console.log(
      '[updateProduct] fetched updated product images',
      productImages
    );
  }

  if (!product) {
    // console.error('[updateProduct] no updates were made to the product');
    // throw new Error('No updates were made to the product');

    // fetch the product if only product_images were updated
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Product not found after update');
    }

    product = data;
  }

  return {
    ...sanitizeCreatedAtFromObject(product),
    product_type: (product.product_type || 'single') as ProductType,
    product_images: productImages
      ? productImages.map((p) => p.resource_url)
      : [],
  };
}
