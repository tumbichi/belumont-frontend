import { supabase } from '@core/data/supabase/client';

export default async function getTotalSales(): Promise<number> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, payments!inner(amount, provider),user_id')
    .in('status', ['completed', 'paid'])
    .neq('payments.provider', 'free')
    .neq('user_id', 'ae7a0185-aa7c-4b87-b676-70a52d4be528');

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  if (!data) {
    return 0;
  }

  console.log('orders', data);

  const totalSales = data.reduce((acc, order) => {
    // Aseguramos que payments no es un array y tiene un amount
    if (
      order.payments &&
      !Array.isArray(order.payments) &&
      order.payments.amount
    ) {
      return acc + order.payments.amount;
    }
    return acc;
  }, 0);

  return totalSales;
}
