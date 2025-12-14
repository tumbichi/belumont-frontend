import { supabaseBrowserClient } from '../client';

export default async function uploadImage(
  file: File,
  path: string,
  bucketName = 'public-assets'
): Promise<string> {
  const { data, error} = await supabaseBrowserClient.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error || !data) {
    console.error('[images-manager] uploadImage error', error);
    throw new Error(error.message);
  }

  console.log('[images-manager] uploadImage success', data);

  const {
    data: { publicUrl },
  } = supabaseBrowserClient.storage.from(bucketName).getPublicUrl(path);

  return publicUrl;
}
