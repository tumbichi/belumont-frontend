'use server';
import { supabase } from '@core/data/supabase/client';

export interface ProductBuyer {
  id: string;
  name: string;
  email: string;
}

export default async function getProductBuyers(
  productId: string
): Promise<ProductBuyer[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      user_id,
      users (id, name, email)
    `
    )
    .eq('product_id', productId)
    .in('status', ['completed', 'paid']);

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  // Deduplicate buyers (a user may have multiple orders for the same product)
  const buyersMap = new Map<string, ProductBuyer>();
  for (const order of data) {
    const user = order.users as unknown as {
      id: string;
      name: string;
      email: string;
    } | null;
    if (user && !buyersMap.has(user.id)) {
      buyersMap.set(user.id, {
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }
  }

  return Array.from(buyersMap.values());
}
