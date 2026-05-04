import { supabase } from '../../client';
import {
  PatisserieProduct,
  PatisserieMetadata,
} from '../../../../../modules/patisserie/types/patisserie.types';

export default async function getAllPatisserieProducts(): Promise<
  PatisserieProduct[]
> {
  const { data } = await supabase
    .from('patisserie_products')
    .select('*')
    .eq('active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (!data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    pathname: row.pathname,
    image_url: row.image_url,
    thumbnail_url: row.thumbnail_url,
    active: row.active,
    category: row.category,
    stock_status: row.stock_status as PatisserieProduct['stock_status'],
    metadata: (row.metadata as unknown as PatisserieMetadata) ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}
