/**
 * Client-side function to upload image and update product.
 * Upload happens in the browser, then Server Action updates the DB.
 */

import { ImagesManagerRepository } from '@core/data/images-manager/images-manager.repository';
import { Product } from '@core/data/supabase/products';
import { updateProductImage } from './updateProductImage';
import attempt from '@core/lib/promises/attempt';

export async function uploadAndUpdateProductImage(payload: {
  productId: string;
  imageType: 'cover' | 'thumbnail' | 'gallery';
  file: File;
  oldImageUrl: string;
  productPathname: string;
  galleryIndex?: number;
}): Promise<Product> {
  console.log('[uploadAndUpdateProductImage] start', {
    productId: payload.productId,
    imageType: payload.imageType,
    fileName: payload.file.name,
  });

  // Step 1: Upload image in the browser
  const imagesManagerClient = ImagesManagerRepository();

  // Compress image before upload
  const compressedFile = await imagesManagerClient.compressImage(payload.file);

  console.log(
    '[uploadAndUpdateProductImage] galleryIndex',
    payload.galleryIndex
  );

  const uploadFolder = `products/${payload.productPathname.replaceAll('-', '_')}`;
  const uploadFilename = `${payload.imageType}${typeof payload?.galleryIndex === 'number' ? `_image_${payload.galleryIndex + 1}` : ''}_${Date.now()}`;

  const uploadPath = `${uploadFolder}/${uploadFilename}`;
  //   const uploadPath = "products/product_pathname/image_type";
  console.log('[uploadAndUpdateProductImage] uploading to path:', uploadPath);

  const newImageUrl = await imagesManagerClient.uploadImage(
    compressedFile,
    uploadPath
  );

  console.log('[uploadAndUpdateProductImage] image uploaded:', newImageUrl);

  // Step 2: Call Server Action to update DB with new URL
  const updatedProduct = await updateProductImage({
    productId: payload.productId,
    imageType: payload.imageType,
    newImageUrl,
    uploadPath,
    oldImageUrl: payload.oldImageUrl,
    galleryIndex: payload.galleryIndex,
  });

  const oldImagePath = payload.oldImageUrl.split('public-assets/')[1] ?? '';

  console.log(
    '[uploadAndUpdateProductImage] old image path to delete:',
    oldImagePath
  );

  const { error: deleteImageError } = await attempt(
    imagesManagerClient.deleteImage(oldImagePath)
  );

  if (deleteImageError) {
    console.warn(
      '[uploadAndUpdateProductImage] Failed to delete old image:',
      deleteImageError
    );
  } else {
    console.log(
      '[uploadAndUpdateProductImage] old image deleted:',
      payload.oldImageUrl
    );
  }

  console.log('[uploadAndUpdateProductImage] product updated:', updatedProduct);

  return updatedProduct;
}
