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

  console.log('[products] updateProductImage after product check', product);

  // switch (payload.imageType) {
  // case 'cover': {
  let resource = await resourcesClient.getByUrl(payload.oldImageUrl);

  if (resource) {
    const { data, error } = await attempt(
      resourcesClient.update(resource.id, {
        url: payload.newImageUrl,
      })
    );

    if (error || !data) {
      console.error('[updateProductImage] Failed to update resource', error);
      throw new Error('[updateProductImage] Failed to update resource', {
        cause: error,
      });
    }

    resource = data;
  } else {
    resource = await resourcesClient.create({
      url: payload.newImageUrl,
      bucket: 'public-assets',
      folder: payload.uploadPath,
      provider: 'SUPABASE',
    });
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

      const currentGallery = product.product_images || [];
      currentGallery[payload.galleryIndex] = resource.url;

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
