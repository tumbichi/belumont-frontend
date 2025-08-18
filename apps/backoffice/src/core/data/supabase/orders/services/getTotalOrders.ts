import { supabase } from '@core/data/client';

export default async function getTotalOrders(): Promise<number> {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw error;
  }

  return count || 0;
}
