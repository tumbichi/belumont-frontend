'use server';

import { Product } from '@core/data/supabase/products';
import SupabaseRepository from '@core/data/supabase/supabase.repository';
import attempt from '@core/lib/promises/attempt';

export interface FileWithPreview extends File {
  preview?: string;
}

export const updateProductImage = async (payload: {
  productId: string;
  imageType: 'cover' | 'thumbnail' | 'gallery';
  newImageUrl: string;
  uploadPath: string;
  oldImageUrl: string;
  galleryIndex?: number;
}): Promise<Product> => {
  console.log('[products] updateProductImage start', payload);
  const { products: productsClient, resources: resourcesClient } =
    SupabaseRepository();

  let product = await productsClient.getById(payload.productId);

  if (!product) {
    console.log('[products] updateProductImage product not found');
    throw new Error('Product not found', { cause: 'PRODUCT_NOT_FOUND' });
  }

  console.log('[updateProductImage] product founded', product);

  // switch (payload.imageType) {
  // case 'cover': {
  let resource = await resourcesClient.getByUrl(payload.oldImageUrl);

  if (resource) {
    const { data: updatedResource, error } = await attempt(
      resourcesClient.update(resource.id, {
        url: payload.newImageUrl,
      })
    );

    if (error || !updatedResource) {
      console.error('[updateProductImage] Failed to update resource', error);
      throw new Error('[updateProductImage] Failed to update resource', {
        cause: error,
      });
    }
    resource = updatedResource;
    console.log('[updateProductImage] resource updated', resource);
  } else {
    resource = await resourcesClient.create({
      url: payload.newImageUrl,
      bucket: 'public-assets',
      folder: payload.uploadPath,
      provider: 'SUPABASE',
    });
    console.log('[updateProductImage] resource created', resource);
  }

  switch (payload.imageType) {
    case 'cover': {
      const { data: productUpdated, error } = await attempt(
        productsClient.update(product.id, {
          image_url: resource.url,
        })
      );

      if (error || !productUpdated) {
        throw error;
      }

      product = productUpdated;

      return product;
    }
    case 'thumbnail': {
      const { data: productUpdated, error } = await attempt(
        productsClient.update(product.id, {
          thumbnail_url: resource.url,
        })
      );
      if (error || !productUpdated) {
        throw error;
      }

      product = productUpdated;

      return product;
    }
    case 'gallery': {
      if (payload.galleryIndex === undefined) {
        throw new Error('Gallery index is required for gallery image update');
      }

      console.log(
        '[updateProductImage] updating gallery image at index',
        payload.galleryIndex
      );

      const currentGallery = product.product_images || [];

      console.log(
        '[updateProductImage] current gallery before update',
        currentGallery
      );

      currentGallery[payload.galleryIndex] = resource.url;

      console.log('[updateProductImage] updating gallery', currentGallery);

      const { data: productUpdated, error } = await attempt(
        productsClient.update(product.id, {
          product_images: currentGallery,
        })
      );
      if (error || !productUpdated) {
        console.error(
          '[updateProductImage] Failed to update product gallery',
          error
        );
        throw error;
      }

      product = productUpdated;

      return product;
    }
    default:
      throw new Error('Invalid image type');
  }
};
