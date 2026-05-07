import { supabase } from '@core/data/supabase/client';

/**
 * @deprecated Use `getDashboardKpis` from `core/data/supabase/dashboard/services/getDashboardKpis`
 * instead. This service does not filter by `status = 'completed'` or `EXCLUDED_USER_IDS`.
 * Will be removed once the dashboard is fully migrated.
 */
export default async function getTotalOrders(): Promise<number> {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw error;
  }

  return count || 0;
}
