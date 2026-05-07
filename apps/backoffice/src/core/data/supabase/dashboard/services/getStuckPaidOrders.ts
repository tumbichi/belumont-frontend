import dayjs from 'dayjs';
import { supabase } from '@core/data/supabase/client';
import { StuckPaidOrder } from '@modules/dashboard/types';

export default async function getStuckPaidOrders(
  thresholdMinutes = 10
): Promise<StuckPaidOrder[]> {
  const cutoff = dayjs().subtract(thresholdMinutes, 'minute').toISOString();

  const { data, error } = await supabase
    .from('orders')
    .select('id, updated_at')
    .eq('status', 'paid')
    .lte('updated_at', cutoff)
    .order('updated_at', { ascending: true });

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map((order) => ({
    id: order.id,
    updated_at: order.updated_at,
    minutesElapsed: dayjs().diff(dayjs(order.updated_at), 'minute'),
  }));
}
