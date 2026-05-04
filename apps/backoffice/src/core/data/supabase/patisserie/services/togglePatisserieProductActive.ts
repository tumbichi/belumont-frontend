import { supabase } from '@core/data/supabase/client';
import {
  PatisserieProduct,
  PatisserieMetadata,
} from '@modules/patisserie/types/patisserie.types';

export default async function togglePatisserieProductActive(
  id: string,
  active: boolean
): Promise<PatisserieProduct> {
  const { data, error } = await supabase
    .from('patisserie_products')
    .update({
      active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error(
      '[supabase.patisserie] togglePatisserieProductActive error',
      error
    );
    throw error;
  }

  if (!data) {
    throw new Error('Failed to toggle patisserie product active status');
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
