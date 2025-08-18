import { supabase } from '@core/data/client';

export default async function getTotalUsers(): Promise<number> {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw error;
  }

  return count || 0;
}
