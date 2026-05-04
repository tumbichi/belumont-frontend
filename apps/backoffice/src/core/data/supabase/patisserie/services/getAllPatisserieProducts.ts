import { supabase } from '@core/data/supabase/client';
import {
  PatisserieProduct,
  PatisserieMetadata,
} from '@modules/patisserie/types/patisserie.types';

function mapRow(row: Record<string, unknown>): PatisserieProduct {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    price: row.price as number,
    pathname: row.pathname as string,
    image_url: (row.image_url as string) ?? null,
    thumbnail_url: (row.thumbnail_url as string) ?? null,
    active: row.active as boolean,
    category: (row.category as string) ?? null,
    stock_status: row.stock_status as PatisserieProduct['stock_status'],
    metadata: (row.metadata as unknown as PatisserieMetadata) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export default async function getAllPatisserieProducts(): Promise<
  PatisserieProduct[]
> {
  const { data, error } = await supabase
    .from('patisserie_products')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error(
      '[supabase.patisserie] getAllPatisserieProducts error',
      error
    );
    throw error;
  }

  if (!data) return [];

  return data.map(mapRow);
}
