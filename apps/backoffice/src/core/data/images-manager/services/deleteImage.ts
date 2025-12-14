import { supabaseBrowserClient } from '../client';

export default async function deleteImage(
  url: string,
  bucketName = 'public-assets'
): Promise<void> {
  const { data, error } = await supabaseBrowserClient.storage
    .from(bucketName)
    .remove([url]);

  if (error) {
    console.error('[images-manager] deleteImage error', error);
    throw new Error(error.message);
  }

  console.log('[images-manager] deleteImage success', data);
}
