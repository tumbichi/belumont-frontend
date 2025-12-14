"use server"
import SupabaseRepository from '@core/data/supabase/supabase.repository';

const updateProductPdf = async (
  productId: string,
  {
    download_url,
    old_download_url,
  }: { download_url: string; old_download_url: string }
) => {
  const { products, resources } = SupabaseRepository();

  const resource = await resources.getByUrl(old_download_url);

  if (!resource) {
    throw new Error('Resource not found for the old download URL');
  }

  // Update the resource with the new download URL
  await resources.update(resource.id, { url: download_url });

  const updatedProduct = await products.update(productId, { download_url });

  return updatedProduct;
};

export default updateProductPdf;
