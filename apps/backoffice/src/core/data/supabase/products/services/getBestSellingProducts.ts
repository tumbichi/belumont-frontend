import { supabase } from '@core/data/supabase/client';
import { Product } from '../products.repository';
import sanatizeCreatedAtFromObject from '@core/utils/helpers/sanitizeCreatedAtFromObject';

export interface BestSellingProduct extends Product {
  sales: number;
}

export default async function getBestSellingProducts(
  limit = 5
): Promise<BestSellingProduct[]> {
  // Fetch all completed orders with their associated product data
  const { data: orders, error } = await supabase
    .from('orders')
    .select('products(*)')
    .eq('status', 'completed');

  if (error) {
    throw error;
  }

  if (!orders) {
    return [];
  }

  // Process the data client-side to group and count
  const productSales = new Map<string, BestSellingProduct>();

  for (const order of orders) {


    // NOTE: We need to ensure that the relationship is correctly named 'products'
    // and that RLS policies allow fetching them.
    if (order.products) {
      const product = sanatizeCreatedAtFromObject(order.products);
      const existing = productSales.get(product.id);

      if (existing) {
        existing.sales += 1;
      } else {
        productSales.set(product.id, {
          ...product,
          sales: 1,
        });
      }
    }
  }

  // Convert map to array, sort by sales, and take the top 'limit'
  const sortedProducts = Array.from(productSales.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit);

  return sortedProducts;
}
