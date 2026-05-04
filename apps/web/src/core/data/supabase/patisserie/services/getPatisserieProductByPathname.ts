import { supabase } from '../../client';
import {
  PatisserieProduct,
  PatisserieMetadata,
} from '../../../../../modules/patisserie/types/patisserie.types';

export default async function getPatisserieProductByPathname(
  pathname: string
): Promise<PatisserieProduct | null> {
  const { data } = await supabase
    .from('patisserie_products')
    .select('*')
    .eq('pathname', pathname)
    .eq('active', true)
    .maybeSingle();

  if (!data) {
    return null;
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
