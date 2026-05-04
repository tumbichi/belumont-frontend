import { supabase } from '@core/data/supabase/client';
import {
  PatisserieProduct,
  PatisserieMetadata,
  CreatePatisserieInput,
} from '@modules/patisserie/types/patisserie.types';

export default async function createPatisserieProduct(
  input: CreatePatisserieInput
): Promise<PatisserieProduct> {
  const { data, error } = await supabase
    .from('patisserie_products')
    .insert({
      name: input.name,
      description: input.description,
      price: input.price,
      pathname: input.pathname,
      image_url: input.image_url ?? null,
      thumbnail_url: input.thumbnail_url ?? null,
      active: input.active ?? true,
      category: input.category ?? null,
      stock_status: input.stock_status ?? 'on_request',
      metadata: (input.metadata ?? null) as unknown as null,
    })
    .select('*')
    .single();

  if (error) {
    console.error('[supabase.patisserie] createPatisserieProduct error', error);
    throw error;
  }

  if (!data) {
    throw new Error('Failed to create patisserie product');
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
