import { supabase } from '@core/data/supabase/client';
import { EXCLUDED_USER_IDS } from '@core/constants/excluded-users';
import { DashboardKpisResult, DateRangeParams } from '@modules/dashboard/types';

export interface DashboardKpisParams extends DateRangeParams {}

export default async function getDashboardKpis(
  params: DashboardKpisParams
): Promise<DashboardKpisResult> {
  const fromTs = `${params.from}T00:00:00.000Z`;
  const toTs = `${params.to}T23:59:59.999Z`;

  let revenueQuery = supabase
    .from('orders')
    .select('payments!inner(amount, provider)')
    .eq('status', 'completed')
    .neq('payments.provider', 'free')
    .gte('created_at', fromTs)
    .lte('created_at', toTs);

  let ordersQuery = supabase
    .from('orders')
    .select('payments!inner(amount)', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gt('payments.amount', 0)
    .gte('created_at', fromTs)
    .lte('created_at', toTs);

  if (EXCLUDED_USER_IDS.length > 0) {
    revenueQuery = revenueQuery.not(
      'user_id',
      'in',
      `(${EXCLUDED_USER_IDS.join(',')})`
    );
    ordersQuery = ordersQuery.not(
      'user_id',
      'in',
      `(${EXCLUDED_USER_IDS.join(',')})`
    );
  }

  const [revenueResult, ordersResult] = await Promise.all([
    revenueQuery,
    ordersQuery,
  ]);

  if (revenueResult.error) {
    throw revenueResult.error;
  }

  if (ordersResult.error) {
    throw ordersResult.error;
  }

  const revenue = (revenueResult.data ?? []).reduce((acc, order) => {
    const payment = order.payments;
    if (
      payment &&
      !Array.isArray(payment) &&
      typeof payment.amount === 'number'
    ) {
      return acc + payment.amount;
    }
    return acc;
  }, 0);

  return {
    revenue,
    orders: ordersResult.count ?? 0,
  };
}
