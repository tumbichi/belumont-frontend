'use server';

import {
  BundleItem,
  Product,
  ProductsRepository,
} from '@core/data/supabase/products';
import { revalidatePath } from 'next/cache';

export async function getBundleItemsAction(
  bundleId: string
): Promise<BundleItem[]> {
  const repo = ProductsRepository();
  return repo.getBundleItems(bundleId);
}

export async function getAvailableProductsAction(filters?: {
  active?: boolean;
}): Promise<Product[]> {
  const repo = ProductsRepository();
  return repo.getAll(filters as { active: boolean });
}

export async function addBundleItemsAction(
  bundleId: string,
  productIds: string[]
): Promise<void> {
  const repo = ProductsRepository();
  await repo.addBundleItems(bundleId, productIds);
  revalidatePath(`/productos/${bundleId}`);
}

export async function removeBundleItemAction(
  bundleItemId: string,
  bundleId: string
): Promise<void> {
  const repo = ProductsRepository();
  await repo.removeBundleItem(bundleItemId);
  revalidatePath(`/productos/${bundleId}`);
}
