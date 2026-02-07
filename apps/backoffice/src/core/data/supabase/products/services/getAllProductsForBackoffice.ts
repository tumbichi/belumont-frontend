import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { supabase } from '../../client';
import { Product } from '../products.repository';

export default async function getAllProductsForBackoffice(): Promise<
  Product[]
> {
  const { data, error } = await supabase
    .from('products')
    .select()
    .order('updated_at', { ascending: false });

  console.log('[supabase.products] getAllProductsForBackoffice', data);

  if (error) {
    console.error(
      '[supabase.products] getAllProductsForBackoffice error',
      error
    );
  }

  if (!data) {
    return [];
  }

  return data.map((product) => sanitizeDatesFromObject(product));
}
