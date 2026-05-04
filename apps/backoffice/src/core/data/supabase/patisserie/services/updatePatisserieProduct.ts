import { supabase } from '@core/data/supabase/client';
import {
  PatisserieProduct,
  PatisserieMetadata,
  UpdatePatisserieInput,
} from '@modules/patisserie/types/patisserie.types';

export default async function updatePatisserieProduct(
  id: string,
  updates: UpdatePatisserieInput
): Promise<PatisserieProduct> {
  const { data, error } = await supabase
    .from('patisserie_products')
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.description !== undefined && {
        description: updates.description,
      }),
      ...(updates.price !== undefined && { price: updates.price }),
      ...(updates.pathname !== undefined && { pathname: updates.pathname }),
      ...(updates.image_url !== undefined && { image_url: updates.image_url }),
      ...(updates.thumbnail_url !== undefined && {
        thumbnail_url: updates.thumbnail_url,
      }),
      ...(updates.active !== undefined && { active: updates.active }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.stock_status !== undefined && {
        stock_status: updates.stock_status,
      }),
      ...(updates.metadata !== undefined && {
        metadata: (updates.metadata ?? null) as unknown as null,
      }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('[supabase.patisserie] updatePatisserieProduct error', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to update patisserie product');
  }

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
