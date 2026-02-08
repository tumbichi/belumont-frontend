'use server';
import { supabase } from '@core/data/supabase/client';

export interface ProductBuyer {
  id: string;
  name: string;
  email: string;
}

interface OrderWithUser {
  user_id: string;
  users: {
    id: string;
    name: string;
    email: string;
  } | null;
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
  for (const order of data as unknown as OrderWithUser[]) {
    if (order.users && !buyersMap.has(order.users.id)) {
      buyersMap.set(order.users.id, {
        id: order.users.id,
        name: order.users.name,
        email: order.users.email,
      });
    }
  }

  return Array.from(buyersMap.values());
}
