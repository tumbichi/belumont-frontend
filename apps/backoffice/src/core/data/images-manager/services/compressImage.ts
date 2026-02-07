import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp' as const,
};

/**
 * Compresses an image file before upload.
 * Converts to WebP format and limits size to 1 MB / 1920px max dimension.
 */
export default async function compressImage(file: File): Promise<File> {
  // Skip compression for SVGs or already-small files (< 100 KB)
  if (file.type === 'image/svg+xml' || file.size < 100 * 1024) {
    return file;
  }

  const compressed = await imageCompression(file, COMPRESSION_OPTIONS);

  console.log(
    `[compressImage] ${file.name}: ${(file.size / 1024).toFixed(0)} KB → ${(compressed.size / 1024).toFixed(0)} KB`
  );

  return compressed;
}
