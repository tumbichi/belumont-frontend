/**
 * Server action to update patisserie product image in the database.
 * Upload happens in the browser via ImagesManager, then this updates the DB.
 */

'use server';

import { supabase } from '@core/data/supabase/client';
import { revalidatePath } from 'next/cache';
import {
  PatisserieProduct,
  PatisserieMetadata,
} from '../types/patisserie.types';

export async function updatePatisserieProductImage(payload: {
  productId: string;
  imageType: 'cover' | 'thumbnail';
  newImageUrl: string;
}): Promise<PatisserieProduct> {
  console.log('[patisserie] updatePatisserieProductImage start', payload);

  const fieldToUpdate =
    payload.imageType === 'cover' ? 'image_url' : 'thumbnail_url';

  const { data, error } = await supabase
    .from('patisserie_products')
    .update({
      [fieldToUpdate]: payload.newImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', payload.productId)
    .select('*')
    .single();

  if (error) {
    console.error('[patisserie] updatePatisserieProductImage error', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update patisserie product image');
  }

  console.log('[patisserie] updatePatisserieProductImage completed', data);
  revalidatePath('/pasteleria');
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    pathname: data.pathname,
    image_url: data.image_url,
    thumbnail_url: data.thumbnail_url,
    active: data.active,
    category: data.category,
    stock_status: data.stock_status as PatisserieProduct['stock_status'],
    metadata: (data.metadata as unknown as PatisserieMetadata) ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
