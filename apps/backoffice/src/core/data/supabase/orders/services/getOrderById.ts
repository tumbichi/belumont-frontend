import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { Order } from '../orders.repository';
export default async function getOrderById(id: string): Promise<Order | null> {
  const { data } = await supabase.from('orders').select().eq('id', id);
  return data && data.length > 0 && data[0]
    ? sanitizeDatesFromObject(data[0])
    : null;
}
