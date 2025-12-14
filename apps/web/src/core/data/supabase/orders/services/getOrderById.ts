import { supabase } from '@core/data/supabase/client';
import sanitizeDatesFromObject from '@core/utils/helpers/sanitizeDatesFromObject';
import { Order } from '../orders.repository';

export default async function getOrderById(id: string): Promise<Order | null> {
  const { data } = await supabase.from('orders').select().eq('id', id).single();

  return data ? sanitizeDatesFromObject(data) : null;
}
