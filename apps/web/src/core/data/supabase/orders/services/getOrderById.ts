import { supabase } from '@core/data/supabase/client';
import sanatizeDatesFromObject from '@core/utils/helpers/sanatizeDatesFromObject';
import { Order } from '../orders.repository';

export default async function getOrderById(id: string): Promise<Order | null> {
  const { data } = await supabase.from('orders').select().eq('id', id).single();

  return data ? sanatizeDatesFromObject(data) : null;
}
