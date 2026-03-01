'use server';

import { supabase } from '@core/data/supabase/client';

export interface UserRecipient {
  id: string;
  name: string;
  email: string;
}

export async function getAllUsers(): Promise<UserRecipient[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email')
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as UserRecipient[];
}

export async function getProductBuyersForEmail(
  productId: string
): Promise<UserRecipient[]> {
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

  interface OrderWithUser {
    user_id: string;
    users: { id: string; name: string; email: string } | null;
  }

  const buyersMap = new Map<string, UserRecipient>();
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

export interface ProductForEmail {
  id: string;
  name: string;
  product_type: string | null;
  download_url: string | null;
}

export async function getProducts(): Promise<ProductForEmail[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, product_type, download_url')
    .eq('active', true)
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProductForEmail[];
}

export async function getBundleItems(
  bundleId: string
): Promise<{ name: string; download_url: string | null }[]> {
  const { data, error } = await supabase
    .from('product_bundle_items')
    .select(
      `
      sort_order,
      products:product_id (name, download_url)
    `
    )
    .eq('bundle_id', bundleId)
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  if (!data) return [];

  interface BundleItemRow {
    sort_order: number;
    products: { name: string; download_url: string | null } | null;
  }

  return (data as unknown as BundleItemRow[])
    .filter((item) => item.products !== null)
    .map((item) => ({
      name: item.products!.name,
      download_url: item.products!.download_url,
    }));
}
