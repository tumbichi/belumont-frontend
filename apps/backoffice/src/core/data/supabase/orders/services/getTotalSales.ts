import { supabase } from '@core/data/client';

export default async function getTotalSales(): Promise<number> {
  const { data, error } = await supabase
    .from('payments')
    .select('order_id, orders(product_id, products(price))')
    .eq('status', 'approved');

  if (error) {
    throw error;
  }

  if (!data) {
    return 0;
  }

  const totalSales = data.reduce((acc, payment) => {
    if (payment.orders && payment.orders.products) {
      return acc + payment.orders.products.price;
    }
    return acc;
  }, 0);

  return totalSales;
}
